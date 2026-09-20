import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ROOT_DIR = path.resolve(__dirname, '..');
export const STORAGE_DIR = path.resolve(ROOT_DIR, 'storage');
export const SCREENSHOTS_DIR = path.resolve(STORAGE_DIR, 'screenshots');
export const STORAGE_STATE_PATH = process.env.TILDA_STORAGE_STATE_PATH || path.resolve(STORAGE_DIR, 'storage_state.json');

export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
export const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

import fs from 'fs';

const candidateBravePaths = [
  'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
  'C:\\Program Files (x86)\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
  path.join(process.env.LOCALAPPDATA || '', 'BraveSoftware\\Brave-Browser\\Application\\brave.exe'),
];
export const BRAVE_EXECUTABLE_PATH = candidateBravePaths.find((p) => fs.existsSync(p));

export const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

// Strictly fixed to https://tilda.cc
export const TILDA_BASE_URL = 'https://tilda.cc';

export const TILDA_URLS = {
  LOGIN: 'https://tilda.cc/login/',
  PROJECTS: 'https://tilda.cc/projects/',
  PAGE_BASE: 'https://tilda.cc/page/?pageid=',
  PREVIEW_BASE: 'https://tilda.cc/page/?pageid=',
};

export const VIEWPORTS = {
  DESKTOP: {
    width: 1440,
    height: 900,
  },
  MOBILE: {
    width: 390,
    height: 844,
  },
};

export const BREAKPOINTS = {
  DESKTOP_WIDE: 1200,
  TABLET_LANDSCAPE: 960,
  TABLET_PORTRAIT: 640,
  MOBILE: 480,
};

export const TIMEOUTS = {
  NAVIGATION: 45000,
  ACTION: 15000,
  ACE_READY: 10000,
  PUBLISH: 30000,
};

export const CONFIG = {
  ROOT_DIR,
  STORAGE_DIR,
  SCREENSHOTS_DIR,
  STORAGE_STATE_PATH,
  TILDA_PROJECT_ID: process.env.TILDA_PROJECT_ID || '40607103',
  TILDA_BASE_URL,
  TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID,
  BRAVE_EXECUTABLE_PATH,
  DEFAULT_USER_AGENT,
  VIEWPORTS,
  BREAKPOINTS,
  TIMEOUTS,
};
