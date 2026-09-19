import fs from 'fs';
import readline from 'readline';
import { STORAGE_STATE_PATH, STORAGE_DIR } from '../config.js';
import { SessionManager } from './session-manager.js';

/**
 * Utility to create storage_state.json directly from a raw cookie string
 * copied from DevTools (document.cookie or Network tab Cookie header).
 */
export async function importFromCookieString(rawCookie: string): Promise<boolean> {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }

  const pairs = rawCookie.split(';');
  const cookies = [];

  for (const pair of pairs) {
    const trimmed = pair.trim();
    if (!trimmed) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;

    const name = trimmed.substring(0, eqIdx).trim();
    const value = trimmed.substring(eqIdx + 1).trim();

    cookies.push({
      name,
      value,
      domain: '.tilda.cc',
      path: '/',
      expires: Math.floor(Date.now() / 1000) + 86400 * 30, // 30 days
      httpOnly: false,
      secure: true,
      sameSite: 'Lax' as const,
    });
  }

  const storageState = {
    cookies,
    origins: [
      {
        origin: 'https://tilda.cc',
        localStorage: [],
      },
    ],
  };

  fs.writeFileSync(STORAGE_STATE_PATH, JSON.stringify(storageState, null, 2), 'utf-8');
  console.log(`[OK] Imported ${cookies.length} cookies into ${STORAGE_STATE_PATH}`);

  // Test session
  const sm = new SessionManager();
  console.log('Validating imported session with Tilda...');
  const status = await sm.validateSession();
  console.log('Session Status:', status);
  return status.valid;
}

if (process.argv[1]?.endsWith('import-cookies.ts') || process.argv[1]?.endsWith('import-cookies.js')) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('====================================================');
  console.log('        Tilda Quick Cookie Importer                ');
  console.log('====================================================');
  console.log('Open your logged-in Tilda tab in Brave:');
  console.log('1. Press F12 -> Console');
  console.log('2. Type: copy(document.cookie)  [and press Enter]');
  console.log('3. Paste the copied string below:\n');

  rl.question('Paste document.cookie here: ', async (answer) => {
    rl.close();
    if (!answer || !answer.trim()) {
      console.log('No cookies entered. Exiting.');
      process.exit(1);
    }
    await importFromCookieString(answer.trim());
  });
}
