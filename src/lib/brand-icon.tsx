import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Match LogoMark's display window, using the original artwork at build time.
export async function brandIcon(size: number) {
  const artwork = await readFile(
    join(process.cwd(), "public/brand/ennearock-logo.png"),
  );
  const scale = size / 800;

  return new ImageResponse(
    <div style={{ display: "flex", width: size, height: size, background: "#050607", alignItems: "center" }}>
      <div style={{ display: "flex", position: "relative", overflow: "hidden", width: size, height: 560 * scale }}>
        {/* ImageResponse needs a native image with an embedded source. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          src={`data:image/png;base64,${artwork.toString("base64")}`}
          width={1536 * scale}
          height={1024 * scale}
          style={{ position: "absolute", left: -390 * scale, top: -160 * scale, maxWidth: 1536 * scale }}
        />
      </div>
    </div>,
    { width: size, height: size },
  );
}
