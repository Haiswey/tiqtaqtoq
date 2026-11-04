import { createClient } from '@supabase/supabase-js';

// The publishable key is safe in the browser: row-level security protects the data.
export const SUPABASE_URL = 'https://dtomacgviokomomwqagr.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_1zCKKS3P5krHdgZLWquLAg_P-9M6JG5';

// PKCE returns ?code= after Google log in, which leaves the #/ page routes alone.
export const sb = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { flowType: 'pkce' } });

const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export function newCode() {
  let c = '';
  for (let i = 0; i < 5; i++) c += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  return c;
}

export async function fetchSetByCode(code) {
  const { data, error } = await sb.rpc('get_set_by_code', { p_code: String(code).trim().toUpperCase() });
  if (error) throw error;
  return data && data[0] ? data[0] : null;
}

// Shrink a picture to at most 1024 px and upload it as WebP into the teacher's folder.
export async function uploadPicture(file, userId) {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, 1024 / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise((res) => canvas.toBlob(res, 'image/webp', 0.85));
  const path = `${userId}/${crypto.randomUUID()}.webp`;
  const { error } = await sb.storage.from('question-images').upload(path, blob, { contentType: 'image/webp' });
  if (error) throw error;
  return sb.storage.from('question-images').getPublicUrl(path).data.publicUrl;
}

export async function removePicture(url) {
  const marker = '/question-images/';
  const i = url ? url.indexOf(marker) : -1;
  if (i < 0) return;
  await sb.storage.from('question-images').remove([url.slice(i + marker.length)]);
}
