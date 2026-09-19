import fs from 'fs';
import path from 'path';
import { STORAGE_STATE_PATH, STORAGE_DIR } from '../config.js';

export function saveCookiesFromHeader(cookieHeader: string, domain: string = 'tilda.cc'): void {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }

  const parts = cookieHeader.split(';').map((p) => p.trim()).filter(Boolean);
  const cookies: any[] = [];

  for (const part of parts) {
    const eqIdx = part.indexOf('=');
    if (eqIdx === -1) continue;
    const name = part.slice(0, eqIdx).trim();
    const value = part.slice(eqIdx + 1).trim();

    cookies.push({
      name,
      value,
      domain: domain.startsWith('.') ? domain : `.${domain}`,
      path: '/',
      expires: Date.now() / 1000 + 30 * 86400,
      httpOnly: name === 'PHPSESSID' || name === 'hash' || name === 'userid',
      secure: true,
      sameSite: 'Lax',
    });
  }

  const state = {
    cookies,
    origins: [
      {
        origin: `https://${domain.replace(/^\./, '')}`,
        localStorage: [],
      },
    ],
  };

  fs.writeFileSync(STORAGE_STATE_PATH, JSON.stringify(state, null, 2), 'utf-8');
  console.log(`[AUTH] Successfully saved ${cookies.length} cookies to ${STORAGE_STATE_PATH}`);
}

// If run from command line
if (process.argv[2]) {
  const input = process.argv.slice(2).join(' ');
  saveCookiesFromHeader(input);
}
