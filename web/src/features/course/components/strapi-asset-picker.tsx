import React, { useEffect, useRef, useState } from "react";

type StrapiAsset = {
  id: number;
  name?: string;
  thumbUrl: string;     // small/thumbnail for tiles
  fullUrl: string;      // original (or largest available) for preview
  formats?: Record<string, { url: string }>;
};

/* Env helpers (unchanged) */
function readEnvBaseUrl(): string {
  try {
    const vite = (typeof import.meta !== "undefined" ? (import.meta as any).env : undefined) as any;
    if (vite?.VITE_STRAPI_URL) return String(vite.VITE_STRAPI_URL);
    if ((globalThis as any)?.process?.env?.REACT_APP_STRAPI_URL) {
      return String((globalThis as any).process.env.REACT_APP_STRAPI_URL);
    }
    if (typeof window !== "undefined" && (window as any).__env?.REACT_APP_STRAPI_URL) {
      return String((window as any).__env__.REACT_APP_STRAPI_URL);
    }
  } catch {}
  return "";
}

function readEnvToken(): string {
  try {
    const vite = (typeof import.meta !== "undefined" ? (import.meta as any).env : undefined) as any;
    if (vite?.VITE_STRAPI_API_TOKEN) return String(vite.VITE_STRAPI_API_TOKEN);
    if (vite?.VITE_STRAPI_TOKEN) return String(vite.VITE_STRAPI_TOKEN);
    if ((globalThis as any)?.process?.env?.REACT_APP_STRAPI_API_TOKEN) {
      return String((globalThis as any).process.env.REACT_APP_STRAPI_API_TOKEN);
    }
  } catch {}
  return "";
}

function buildAbsoluteUrl(base: string, maybeRelative?: string) {
  if (!maybeRelative) return "";
  if (maybeRelative.startsWith("http://") || maybeRelative.startsWith("https://")) return maybeRelative;
  const cleanedBase = base.replace(/\/$/, "");
  if (!maybeRelative.startsWith("/")) return `${cleanedBase}/${maybeRelative}`;
  return `${cleanedBase}${maybeRelative}`;
}

/* Component
   Props:
   - baseUrl: optional Strapi base URL
   - selectedId: currently selected asset id
   - onSelect: callback when asset chosen
   - useCredentials: include cookies for session auth
*/
export default function StrapiAssetPicker({
  baseUrl = "",
  selectedId,
  onSelect,
  useCredentials = false,
}: {
  baseUrl?: string;
  selectedId?: number | null;
  onSelect: (asset: StrapiAsset | null) => void;
  useCredentials?: boolean;
}) {
  const [assets, setAssets] = useState<StrapiAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // local scroll container ref (we keep scroll inside the grid only)
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;

    const resolvedBase = (baseUrl || "").trim() || readEnvBaseUrl();
    if (!resolvedBase) {
      setError("Strapi baseUrl not provided. Set VITE_STRAPI_URL or REACT_APP_STRAPI_URL.");
      return;
    }

    const cleanBase = resolvedBase.replace(/\/$/, "");
    const apiPrefix = cleanBase.endsWith("/api") ? cleanBase : `${cleanBase}/api`;
    const url = `${apiPrefix}/upload/files?pagination[page]=1&pagination[pageSize]=50`;
    const token = readEnvToken();

    const fetchAssets = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          ...(useCredentials ? { credentials: "include" } : {}),
        });

        const raw = await res.text();
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${raw.slice(0, 500)}`);

        let data: any;
        try {
          data = raw ? JSON.parse(raw) : null;
        } catch {
          throw new Error(`Non-JSON response from ${url}. Body (first 500 chars): ${raw.slice(0, 500)}`);
        }

        // eslint-disable-next-line no-console
        console.debug("StrapiAssetPicker.rawResponse", data);

        let rawList: any[] = [];
        if (Array.isArray(data)) rawList = data;
        else if (Array.isArray(data?.data)) rawList = data.data;
        else if (Array.isArray(data?.results)) rawList = data.results;

        const baseNoApi = apiPrefix.replace(/\/api$/, "");
        const map = new Map<number, StrapiAsset>();

        rawList.forEach((item) => {
          const id = item?.id ?? item?.attributes?.id;
          if (id == null) return;

          const formats =
            item?.formats ??
            item?.attributes?.formats ??
            undefined;

          // original file url from v4 upload plugin is at item.url or attributes.url
          const originalUrlRaw =
            item?.url ??
            item?.attributes?.url ??
            undefined;

          const name =
            item?.name ??
            item?.attributes?.name ??
            item?.alternativeText ??
            item?.attributes?.alternativeText ??
            undefined;

          const fullRaw =
            originalUrlRaw ??
            formats?.large?.url ??
            formats?.medium?.url ??
            formats?.small?.url ??
            formats?.thumbnail?.url;

          const thumbRaw =
            formats?.thumbnail?.url ??
            formats?.small?.url ??
            formats?.medium?.url ??
            originalUrlRaw;

          if (!fullRaw || !thumbRaw) return;

          const fullUrl = buildAbsoluteUrl(baseNoApi, fullRaw);
          const thumbUrl = buildAbsoluteUrl(baseNoApi, thumbRaw);

          map.set(Number(id), {
            id: Number(id),
            name,
            thumbUrl,
            fullUrl,
            formats,
          });
        });

        const finalList = Array.from(map.values());
        if (mounted) setAssets(finalList);
      } catch (e: any) {
        if (mounted) setError(String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAssets();
    return () => {
      mounted = false;
    };
    // NOTE: selectedId/onSelect do not need to trigger refetch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseUrl, useCredentials]);

  if (loading) return <div>Loading assets…</div>;
  if (error) return <div className="text-red-600">Error loading assets: {error}</div>;
  if (!assets.length) return <div>No assets found.</div>;

  return (
    <div
      ref={scrollRef}
      style={{
        // confine scroll to this box to avoid window scroll jumps
        maxHeight: 440,
        overflow: "auto",
        border: "1px solid #e5e7eb",
        padding: 8,
        borderRadius: 8,
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,120px)", gap: 8 }}>
        {assets.map((a) => {
          const isSelected = selectedId === a.id;
          return (
            <button
              key={a.id}
              type="button"
              // Prevent focus/scroll on pointer down (covers mouse & touch)
              onPointerDown={(e) => {
                e.preventDefault();
              }}
              tabIndex={-1}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSelect(a);
              }}
              style={{
                border: isSelected ? "2px solid #2563eb" : "1px solid #e5e7eb",
                padding: 0,
                background: "white",
                cursor: "pointer",
                textAlign: "left",
                borderRadius: 6,
                overflow: "hidden",
              }}
              aria-pressed={isSelected}
            >
              <img
                src={a.thumbUrl}
                alt={a.name ?? "asset"}
                loading="lazy"
                decoding="async"
                style={{ width: 120, height: 80, objectFit: "cover", display: "block" }}
              />
              <div
                title={a.name}
                style={{
                  fontSize: 11,
                  padding: "4px 6px",
                  maxWidth: 120,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {a.name}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
