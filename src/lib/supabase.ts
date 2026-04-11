import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

function makeFallbackId(): string {
  return `nourish-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function getDeviceId(): string {
  if (typeof window === 'undefined') return 'server';

  const existingId = localStorage.getItem('nourish_device_id');
  if (existingId) return existingId;

  const id =
    typeof globalThis.crypto !== 'undefined' &&
    typeof globalThis.crypto.randomUUID === 'function'
      ? globalThis.crypto.randomUUID()
      : makeFallbackId();

  localStorage.setItem('nourish_device_id', id);
  return id;
}