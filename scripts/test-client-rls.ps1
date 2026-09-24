# Local-only RLS regression runner. Requires Docker and an existing postgres:17-alpine image.
# No host port, host volume, .env file, Supabase credentials or production connection is used.
# The minimal auth/storage stubs make the application's actual migrations executable
# on plain Postgres; this checks database grants and RLS, not Supabase Auth or PostgREST.
$ErrorActionPreference = 'Stop'
$testRoot = Split-Path $PSScriptRoot -Parent
$containerName = 'ennearock-client-rls-' + [guid]::NewGuid().ToString('N')
$databaseName = 'ennearock_client_rls_test'
$created = $false

function Invoke-TestSql([string] $Sql) {
    $Sql | docker exec -i $containerName psql -X --host 127.0.0.1 --set ON_ERROR_STOP=1 --username postgres --dbname $databaseName
    if ($LASTEXITCODE -ne 0) { throw 'Local RLS SQL verification failed.' }
}

try {
    docker run --detach --rm --pull never --network none --name $containerName --env POSTGRES_HOST_AUTH_METHOD=trust --env "POSTGRES_DB=$databaseName" postgres:17-alpine | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'Could not start the isolated Postgres test container.' }
    $created = $true

    $ready = $false
    for ($attempt = 0; $attempt -lt 30; $attempt++) {
        # The image first starts a socket-only bootstrap server, before creating
        # POSTGRES_DB. Wait for the final TCP listener, not that temporary server.
        docker exec $containerName pg_isready --host 127.0.0.1 --username postgres --dbname $databaseName *> $null
        if ($LASTEXITCODE -eq 0) { $ready = $true; break }
        Start-Sleep -Milliseconds 500
    }
    if (-not $ready) { throw 'Local Postgres did not become ready.' }

    Invoke-TestSql @'
create role anon nologin;
create role authenticated nologin;
create role service_role nologin bypassrls;
create schema auth;
create schema storage;
create schema extensions;
grant usage on schema public, auth, storage to anon, authenticated, service_role;
-- Reproduce legacy broad Supabase defaults so the migration must remove them.
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
create table auth.users (id uuid primary key, email text, raw_user_meta_data jsonb default '{}'::jsonb);
create function auth.uid() returns uuid language sql stable as $$
  select (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')::uuid;
$$;
create function auth.jwt() returns jsonb language sql stable as $$
  select nullif(current_setting('request.jwt.claims', true), '')::jsonb;
$$;
create table storage.buckets (
  id text primary key, name text not null, public boolean default false,
  file_size_limit bigint, allowed_mime_types text[]
);
create table storage.objects (
  id uuid primary key default gen_random_uuid(), bucket_id text references storage.buckets(id)
);
alter table storage.objects enable row level security;
'@

    Get-ChildItem -LiteralPath (Join-Path $testRoot 'supabase/migrations') -Filter '*.sql' |
        Sort-Object Name |
        ForEach-Object {
            Write-Output ('Applying local test migration: ' + $_.Name)
            Invoke-TestSql (Get-Content -LiteralPath $_.FullName -Raw)
        }
    Invoke-TestSql (Get-Content -LiteralPath (Join-Path $PSScriptRoot 'test-client-rls.sql') -Raw)
    Write-Output 'Client request RLS regression tests passed. All test fixtures rolled back.'
}
finally {
    if ($created) {
        # Exact random container created above; --rm removes only its disposable test data.
        docker stop --time 2 $containerName | Out-Null
    }
}
