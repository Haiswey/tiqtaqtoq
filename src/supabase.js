import { createClient } from '@supabase/supabase-js';

// The publishable key is safe in the browser: row-level security protects the data.
export const SUPABASE_URL = 'https://dtomacgviokomomwqagr.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_1zCKKS3P5krHdgZLWquLAg_P-9M6JG5';
// Public ID of the Google login client (Google Cloud project tiq-taq-toq); not a secret.
export const GOOGLE_CLIENT_ID = '610258036852-m7ceqggtau7518f3f1n6qp69t1cksra8.apps.googleusercontent.com';

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

const BUCKET = 'question-images';
const MAX_SIDE = 800; // the question card shows pictures at most ~600 px tall
const ONE_YEAR = '31536000';

const encode = (canvas, type, quality) => new Promise((res) => canvas.toBlob(res, type, quality));

/**
 * Shrink a picture to at most 800 px and upload it into the teacher's folder.
 * The file is named by its content, so the same picture uploaded twice is stored once, and
 * because a name never changes its content, devices may keep it for a year.
 * Returns { url, created }; created is false when the teacher already had this picture.
 */
export async function uploadPicture(file, userId) {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  // Safari cannot make WebP and silently returns a large PNG; use JPEG there.
  let blob = await encode(canvas, 'image/webp', 0.75);
  if (!blob || blob.type !== 'image/webp') blob = await encode(canvas, 'image/jpeg', 0.8);
  const ext = blob.type === 'image/webp' ? 'webp' : 'jpg';

  const digest = await crypto.subtle.digest('SHA-256', await blob.arrayBuffer());
  const hash = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
  const path = `${userId}/${hash}.${ext}`;
  const { error } = await sb.storage.from(BUCKET).upload(path, blob, { contentType: blob.type, cacheControl: ONE_YEAR });
  const exists = error && (String(error.statusCode) === '409' || /exists|duplicate/i.test(error.message));
  if (error && !exists) throw error;
  return { url: sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl, created: !error };
}

const pathOf = (url) => {
  const marker = `/${BUCKET}/`;
  const i = url ? url.indexOf(marker) : -1;
  return i < 0 ? null : url.slice(i + marker.length);
};

// Delete pictures that none of the teacher's saved sets uses any more (a picture can be shared by sets).
export async function removeUnusedPictures(urls) {
  const candidates = [...new Set(urls.filter(Boolean))];
  if (!candidates.length) return;
  const { data, error } = await sb.from('question_sets').select('questions');
  if (error) return;
  const used = new Set(data.flatMap((s) => (s.questions || []).map((q) => q.image)).filter(Boolean));
  const paths = candidates.filter((u) => !used.has(u)).map(pathOf).filter(Boolean);
  if (paths.length) await sb.storage.from(BUCKET).remove(paths);
}
