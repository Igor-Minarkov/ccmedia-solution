import type { JsonBinResponse, Product } from "./types";

const ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

if (!ENDPOINT) {
  throw new Error("Missing VITE_API_ENDPOINT environment variable");
}

export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  const res = await fetch(ENDPOINT, { signal });

  if (!res.ok) {
    throw new Error(`API error (${res.status})`);
  }

  const data = (await res.json()) as JsonBinResponse<Product[]>;

  if (!data?.record || !Array.isArray(data.record)) {
    throw new Error("Invalid API response shape");
  }

  return data.record;
}
