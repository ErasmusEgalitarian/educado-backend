import React, { useEffect, useState } from "react";

type StrapiAsset = {
  id: number;
  name?: string;
  url: string;
  formats?: Record<string, { url: string }>;
};

function readEnvBaseUrl(): string {
  try {
    // Vite
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vite = (typeof import.meta !== "undefined" ? (import.meta as any).env : undefined) as any;
    if (vite?.VITE_STRAPI_URL) return String(vite.VITE_STRAPI_URL);
    if (typeof process !== "undefined" && (process as any)?.env?.REACT_APP_STRAPI_URL) {
      return String((process as any).env.REACT_APP_STRAPI_URL);
    }
    // window fallback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== "undefined" && (window as any).__env?.REACT_APP_STRAPI_URL) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return String((window as any).__env.REACT_APP_STRAPI_URL);
    }
  } catch {}
  return "";
}

function readEnvToken(): string {
  try {
    const vite = (typeof import.meta !== "undefined" ? (import.meta as any).env : undefined) as any;
    if (vite?.VITE_STRAPI_API_TOKEN) return String(vite.VITE_STRAPI_API_TOKEN);
    if (vite?.VITE_STRAPI_TOKEN) return String(vite.VITE_STRAPI_TOKEN);
    if (typeof process !== "undefined" && (process as any)?.env?.REACT_APP_STRAPI_API_TOKEN) {
      return String((process as any).env.REACT_APP_STRAPI_API_TOKEN);
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

  useEffect(() => {
    let mounted = true;
    const resolvedBase = (baseUrl || "").trim() || readEnvBaseUrl();
    if (!resolvedBase) {
      setError("Strapi baseUrl not provided. Set VITE_STRAPI_URL or REACT_APP_STRAPI_URL.");
      return;
    }

    const cleanBase = resolvedBase.replace(/\/$/, "");
    // call /api/upload/files for Strapi v4; if user already provided /api include that
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

        if (!res.ok) {
          throw new Error(`${res.status} ${res.statusText}: ${raw.slice(0, 500)}`);
        }

        let data: any;
        try {
          data = raw ? JSON.parse(raw) : null;
        } catch {
          throw new Error(`Non-JSON response from ${url}. Body (first 500 chars): ${raw.slice(0, 500)}`);
        }

        // Debug: log the shape so you can inspect why counts differ
        // Open DevTools Console to view
        // eslint-disable-next-line no-console
        console.debug("StrapiAssetPicker.rawResponse", data);

        // Normalize list candidates from common Strapi shapes:
        // - Array of items
        // - { data: [...] } shape
        // - { data: [{ id, attributes: { ... } }] } shape (Graph-style)
        let rawList: any[] = [];
        if (Array.isArray(data)) rawList = data;
        else if (Array.isArray(data?.data)) rawList = data.data;
        else if (Array.isArray(data?.results)) rawList = data.results;
        else rawList = [];

        // Normalize each item and dedupe by id
        const map = new Map<number, StrapiAsset>();
        rawList.forEach((item) => {
          // Support both plain and attributes-wrapped item shapes
          const id = item?.id ?? item?.attributes?.id;
          if (id == null) return;

          // Prefer formats.thumbnail.url, otherwise attributes.url or url
          const formats =
            item?.formats ??
            item?.attributes?.formats ??
            undefined;

          const urlField =
            item?.url ??
            item?.attributes?.url ??
            item?.attributes?.formats?.thumbnail?.url ??
            undefined;

          const name =
            item?.name ??
            item?.attributes?.name ??
            item?.alternativeText ??
            item?.attributes?.alternativeText ??
            undefined;

          // Try to find thumbnail if available
          let candidateUrl =
            formats?.thumbnail?.url ??
            formats?.small?.url ??
            formats?.medium?.url ??
            urlField ??
            undefined;

          if (!candidateUrl && typeof item?.attributes?.mime === "string") {
            // fallback: sometimes Strapi returns local path under attributes.formats
            candidateUrl = urlField;
          }

          if (!candidateUrl) return;

          const abs = buildAbsoluteUrl(apiPrefix.replace(/\/api$/, ""), candidateUrl);
          map.set(Number(id), { id: Number(id), name, url: abs, formats });
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
  }, [baseUrl, selectedId, onSelect, useCredentials]);

  if (loading) return <div>Loading assets…</div>;
  if (error) return <div className="text-red-600">Error loading assets: {error}</div>;
  if (!assets.length) return <div>No assets found.</div>;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,120px)", gap: 8 }}>
      {assets.map((a) => {
        const isSelected = selectedId === a.id;
        return (
          <button
            key={a.id}
            type="button"
            onClick={() => onSelect(a)}
            style={{
              border: isSelected ? "2px solid #2563eb" : "1px solid #e5e7eb",
              padding: 0,
              background: "white",
              cursor: "pointer",
              textAlign: "left",
            }}
            aria-pressed={isSelected}
          >
            <img src={a.url} alt={a.name ?? "asset"} style={{ width: 120, height: 80, objectFit: "cover", display: "block" }} />
            <div style={{ fontSize: 11, padding: "4px 6px", maxWidth: 120, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {a.name}
            </div>
          </button>
        );
      })}
    </div>
  );
}