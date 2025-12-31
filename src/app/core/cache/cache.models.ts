export interface CacheEntry<T = any> {
  key: string;
  response: SerializedHttpResponse<T>;
  timestamp: number;
  ttl: number;
  lastAccess: number;
}

export interface SerializedHttpResponse<T> {
  body: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  url: string | null;
}

export interface CacheStore {
  version: string;
  entries: CacheEntry[];
}
