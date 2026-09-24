"use client";

import { useRef, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Icon } from "./icon";
import { inputClassName } from "./editor-fields";

const acceptedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export function CoverImageField({
  value,
  accent,
  onChange,
  onUploadingChange,
}: {
  value: string;
  accent: string;
  onChange: (value: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function upload(file: File) {
    setMessage("");
    if (!acceptedTypes.has(file.type)) {
      setMessage("Choose a JPG, PNG, WebP, or AVIF image.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setMessage("The cover image must be smaller than 8 MB.");
      return;
    }

    setUploading(true);
    onUploadingChange?.(true);
    try {
      const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const path = "covers/" + crypto.randomUUID() + "." + extension;
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.storage.from("portfolio").upload(path, file, {
        cacheControl: "31536000",
        contentType: file.type,
        upsert: false,
      });
      if (error) {
        setMessage(
          error.message.toLowerCase().includes("bucket")
            ? "Media storage is not ready yet. Apply the admin-content migration first."
            : "Upload failed. Confirm this account has the database admin role.",
        );
        return;
      }
      const { data } = supabase.storage.from("portfolio").getPublicUrl(path);
      onChange(data.publicUrl);
      setMessage("Cover uploaded. Save the project to keep this change.");
    } catch {
      setMessage("Upload failed. Check the Supabase connection and try again.");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <div
        className="relative flex min-h-56 items-center justify-center overflow-hidden rounded-[16px] border border-[var(--line)] bg-surface-muted"
        style={{ backgroundColor: value ? undefined : accent }}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img alt="Current project cover" className="absolute inset-0 h-full w-full object-cover" src={value} />
        ) : (
          <>
            <span className="absolute -right-10 -top-16 h-48 w-48 rounded-full border-[34px] border-white/25" />
            <span className="relative grid h-12 w-12 place-items-center rounded-[14px] bg-white/45 text-ink backdrop-blur">
              <Icon className="h-5 w-5" name="projects" />
            </span>
          </>
        )}
        <div className="absolute inset-x-3 bottom-3 flex flex-wrap justify-end gap-2">
          <button
            className="inline-flex h-9 items-center gap-2 rounded-[10px] bg-ink px-3 text-[9px] font-semibold text-white shadow-lg disabled:cursor-wait disabled:opacity-65"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            type="button"
          >
            <Icon className="h-3.5 w-3.5" name={uploading ? "clock" : "arrow-up"} />
            {uploading ? "Uploading…" : value ? "Replace image" : "Upload cover"}
          </button>
          {value ? (
            <button
              className="h-9 rounded-[10px] bg-white/90 px-3 text-[9px] font-semibold text-[#7b4439] shadow-lg backdrop-blur"
              onClick={() => onChange("")}
              type="button"
            >
              Remove
            </button>
          ) : null}
        </div>
      </div>
      <input
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
        }}
        ref={inputRef}
        type="file"
      />
      <label className="mt-4 block text-[10px] font-semibold text-ink">
        Or paste an image URL
        <input
          className={inputClassName}
          maxLength={1000}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://…"
          type="url"
          value={value}
        />
      </label>
      <p
        aria-live="polite"
        className={"mt-2 text-[9px] leading-4 " + (message.includes("failed") || message.includes("must") || message.includes("Choose") || message.includes("not ready") ? "text-[#9b4f40]" : "text-[#617548]")}
      >
        {message || "Landscape images work best. JPG, PNG, WebP, or AVIF; maximum 8 MB."}
      </p>
    </div>
  );
}
