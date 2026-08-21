// Global TypeScript definitions

export type Nullable<T> = T | null;
export type AsyncResponse<T> = Promise<{ data: T; error?: string }>;
