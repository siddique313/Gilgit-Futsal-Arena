/**
 * Backend API base URL. Use in client and server components.
 */
export function getApiBase(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "";
}

/**
 * WebSocket URL for realtime updates (same host as API, ws protocol).
 */
export function getWsUrl(): string {
  if (typeof window !== "undefined") {
    const api = process.env.NEXT_PUBLIC_API_URL ?? "";
    if (!api) return "";
    const url = new URL(api);
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    return url.origin;
  }
  return "";
}

type RequestInitWithJSON = Omit<RequestInit, "body"> & {
  body?: any;
};

async function request<T>(
  path: string,
  init: RequestInitWithJSON = {},
): Promise<T> {
  const base = getApiBase();
  const url = path.startsWith("http")
    ? path
    : `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...init.headers,
  };
  const body =
    init.body !== undefined &&
    typeof init.body === "object" &&
    init.body !== null
      ? JSON.stringify(init.body)
      : (init.body as BodyInit | undefined);
  const res = await fetch(url, { ...init, headers, body });
  if (!res.ok) {
    const text = await res.text();
    let err: Error & { status?: number } = new Error(
      text || `HTTP ${res.status}`,
    );
    (err as Error & { status?: number }).status = res.status;
    throw err;
  }
  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json"))
    return res.json() as Promise<T>;
  return undefined as T;
}

const apiMethods = {
  get: <T>(path: string, init?: RequestInit) =>
    request<T>(path, { ...init, method: "GET" }),
  post: <T>(path: string, body?: any, init?: RequestInit) =>
    request<T>(path, { ...init, method: "POST", body }),
  put: <T>(path: string, body?: any, init?: RequestInit) =>
    request<T>(path, { ...init, method: "PUT", body }),
  patch: <T>(path: string, body?: any, init?: RequestInit) =>
    request<T>(path, { ...init, method: "PATCH", body }),
  delete: <T>(path: string, init?: RequestInit) =>
    request<T>(path, { ...init, method: "DELETE" }),
};

export const api = Object.assign(request, apiMethods);
