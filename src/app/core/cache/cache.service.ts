import { Injectable } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { CacheEntry, CacheStore, SerializedHttpResponse } from './cache.models';
import { CACHE_CONFIG } from './cache-config';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private cache = new Map<string, CacheEntry>();

  constructor() {
    this.loadFromStorage();
  }

  get<T>(key: string): HttpResponse<T> | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.delete(key);
      return null;
    }

    entry.lastAccess = Date.now();
    this.persist();

    return this.deserializeResponse(entry.response);
  }

  set<T>(key: string, response: HttpResponse<T>, ttl?: number): void {
    const entry: CacheEntry = {
      key,
      response: this.serializeResponse(response),
      ttl: ttl || CACHE_CONFIG.defaultTTL,
      timestamp: Date.now(),
      lastAccess: Date.now(),
    };

    this.cache.set(key, entry);

    this.evictIfNeeded();
    this.persist();

    this.log(`Cached: ${key}`);
  }

  delete(key: string): void {
    this.cache.delete(key);
    this.persist();
  }

  clear(): void {
    this.cache.clear();
    this.persist();
  }

  private handleVersioning(store: CacheStore | null): void {
    if (!store || store.version !== CACHE_CONFIG.appVersion) {
      this.log('App version changed → Clearing cache');
      this.clear();
    }
  }

  private loadFromStorage(): void {
    const data = sessionStorage.getItem(CACHE_CONFIG.storageKey);
    if (!data) return;

    try {
      const store: CacheStore = JSON.parse(data);
      this.handleVersioning(store);

      store.entries.forEach((e) => this.cache.set(e.key, e));
    } catch {
      this.clear();
    }
  }


private persist(): void {
  const store: CacheStore = {
    version: CACHE_CONFIG.appVersion,
    entries: Array.from(this.cache.values())
  };

  sessionStorage.setItem(
    CACHE_CONFIG.storageKey,
    JSON.stringify(store)
  );
}

  private evictIfNeeded(): void {
    if (this.cache.size <= CACHE_CONFIG.maxCacheSize) return;

    const sorted = [...this.cache.values()].sort(
      (a, b) => a.lastAccess - b.lastAccess
    );

    const removeCount = this.cache.size - CACHE_CONFIG.maxCacheSize;

    for (let i = 0; i < removeCount; i++) {
      this.cache.delete(sorted[i].key);
      this.log(`LRU Evicted: ${sorted[i].key}`);
    }
  }

  private serializeResponse<T>(
    res: HttpResponse<T>
  ): SerializedHttpResponse<T> {
    return {
      body: res.body!,
      status: res.status,
      statusText: res.statusText,
      headers: this.headersToJson(res.headers),
      url: res.url ?? null,
    };
  }

  private headersToJson(headers: HttpHeaders): Record<string, string> {
    const obj: Record<string, string> = {};
    headers.keys().forEach((k) => (obj[k] = headers.get(k) || ''));
    return obj;
  }

  private deserializeResponse<T>(
    data: SerializedHttpResponse<T>
  ): HttpResponse<T> {
    return new HttpResponse<T>({
      body: data.body,
      status: data.status,
      statusText: data.statusText,
      headers: new HttpHeaders(data.headers),
      url: data.url ?? undefined,
    });
  }

  private log(msg: string): void {
    if (CACHE_CONFIG.debug) console.log(`[CACHE] ${msg}`);
  }
  
}
