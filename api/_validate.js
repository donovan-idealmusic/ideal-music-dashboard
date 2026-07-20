// api/_validate.js — Protected-message validation shared by UI and server.
// Goal: block any attempt to share contact info or identify the other party
// (emails, phones, social handles, links, platform names) including obfuscation.
// Usage:
//   import { screenMessage, NEUTRAL_BLOCK_MSG } from './_validate.js';
//   const r = screenMessage(text);  // { ok: boolean, reason?: string }
// The `reason` is coarse and MUST NOT be shown verbatim to the sender if it
// would help them bypass the filter — the UI/server shows NEUTRAL_BLOCK_MSG.

export const NEUTRAL_BLOCK_MSG =
  'Messages cannot include personal contact information, external links, social media accounts, or information that could identify either party.';

// ---- normalization: collapse common obfuscation so detectors see the intent
function normalize(input) {
  let s = String(input || '').toLowerCase();

  // strip zero-width + combining marks
  s = s.normalize('NFKD').replace(/[̀-ͯ​-‏‪-‮⁠﻿]/g, '');

  // leetspeak → letters
  const leet = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '@': 'a', '$': 's' };
  // (apply leet only for word-detection copy, keep a separate raw copy for numbers)
  const wordy = s.replace(/[013457@$]/g, (c) => leet[c] || c);

  // spelled-out separators used to disguise emails/urls: [at] (at) {dot} " dot " etc.
  const deob = (x) => x
    .replace(/[\[\(\{\<]\s*(at|arroba)\s*[\]\)\}\>]/g, '@')
    .replace(/\s+(at|arroba)\s+/g, '@')
    .replace(/[\[\(\{\<]\s*(dot|punto)\s*[\]\)\}\>]/g, '.')
    .replace(/\s+(dot|punto)\s+/g, '.')
    .replace(/\s*\(\s*dot\s*\)\s*/g, '.')
    // collapse whitespace that obfuscation left around @ and . so detectors see the real token
    .replace(/\s*@\s*/g, '@')
    .replace(/\s*\.\s*/g, '.');

  return { raw: s, wordy: deob(wordy), deob: deob(s) };
}

// spelled-out digit words → count them (e.g. "two two two one two three ...")
const NUMWORDS = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  cero: 0, uno: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, oh: 0,
};

function spelledDigitRun(text) {
  const tokens = text.split(/[^a-záéíóúñ]+/i).filter(Boolean);
  let run = 0, max = 0;
  for (const t of tokens) {
    if (t in NUMWORDS) { run++; max = Math.max(max, run); }
    else run = 0;
  }
  return max; // longest consecutive spelled-digit run
}

const PLATFORMS = [
  'instagram', 'insta', 'ig', 'tiktok', 'tik tok', 'facebook', 'fb', 'messenger',
  'whatsapp', 'whats app', 'wsp', 'wa', 'telegram', 'tg', 'snapchat', 'snap',
  'discord', 'linkedin', 'twitter', 'x.com', 'reddit', 'onlyfans', 'youtube',
  'gmail', 'hotmail', 'outlook', 'proton', 'icloud',
];

const INTENT_PHRASES = [
  'contact me', 'contactame', 'contáctame', 'dm me', 'message me', 'msg me',
  'follow me', 'find me on', 'reach me', 'my profile', 'my handle', 'my number',
  'my email', 'mi correo', 'mi numero', 'mi número', 'my socials', 'social media',
  'outside the platform', 'off platform', 'add me', 'text me', 'call me',
  'escribeme', 'escríbeme', 'llamame', 'llámame', 'buscame', 'búscame',
];

// ---- the screening function
export function screenMessage(input) {
  const original = String(input || '');
  const { raw, wordy, deob } = normalize(original);

  // 1) explicit email (incl. de-obfuscated "name at domain dot com")
  if (/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(deob)) return block('email');

  // 2) URLs / links / domains (http, www, or bare domain.tld, incl. common TLDs)
  if (/\b(?:https?:\/\/|www\.)\S+/i.test(deob)) return block('link');
  if (/\b[a-z0-9-]+\.(?:com|net|org|io|me|co|app|link|gg|tv|xyz|info|biz|es|mx|to)\b/i.test(deob)) return block('domain');

  // 3) social handles: @username (not an email), or "ig: user", "tg - user"
  if (/(^|[^a-z0-9._%+-])@[a-z0-9._]{2,}/i.test(deob)) return block('handle');
  if (/\b(ig|fb|tt|tg|wa|sc|yt|insta|tiktok|telegram|whatsapp|snap|discord|twitter|x)\s*[:\-=/]\s*@?[a-z0-9._]{2,}/i.test(wordy)) return block('handle');

  // 4) platform names / intent to move off-platform
  for (const p of PLATFORMS) {
    const re = new RegExp('(^|[^a-z])' + p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '($|[^a-z])', 'i');
    if (re.test(wordy)) return block('platform');
  }
  for (const p of INTENT_PHRASES) if (wordy.includes(p)) return block('intent');

  // 5) phone numbers: 7+ digits allowing spaces/dashes/dots/() between, or +country
  const digitish = raw.replace(/[^\d+]/g, ' ');
  if (/(?:\+?\d[\s.\-()]*){7,}/.test(original)) return block('phone');
  if (/\+\d{6,}/.test(digitish)) return block('phone');

  // 6) spelled-out digit runs (e.g. "two two two one two three four five six")
  if (spelledDigitRun(raw) >= 5) return block('spelled_phone');

  // 7) long bare digit sequences (order refs are usually < 7; phones are 7+)
  if (/\b\d{7,}\b/.test(original)) return block('digits');

  return { ok: true };
}

function block(reason) { return { ok: false, reason }; }

// Optional: soft warning for the UI (does not block) — e.g. mentions of "number"
export function looksRisky(input) {
  const { wordy } = normalize(input);
  return /\b(number|numero|número|contact|correo|email|handle|user(name)?)\b/i.test(wordy);
}

export default screenMessage;
