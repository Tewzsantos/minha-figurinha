// In-memory store — fine for a single serverless instance during dev.
// In production, swap this Map for a real DB (Vercel KV, Postgres, etc.)

export interface FigurinhaRecord {
  id: string
  name: string
  watermarkUrl: string
  cleanUrl: string
  paid: boolean
  createdAt: Date
}

declare global {
  // survive Next.js hot-reload between requests in dev
  // eslint-disable-next-line no-var
  var __figurinhaStore: Map<string, FigurinhaRecord> | undefined
}

export const figurinhaStore: Map<string, FigurinhaRecord> =
  globalThis.__figurinhaStore ?? (globalThis.__figurinhaStore = new Map())

export function markAsPaid(id: string) {
  const record = figurinhaStore.get(id)
  if (record) figurinhaStore.set(id, { ...record, paid: true })
}
