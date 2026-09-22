import { TildaHttpClient } from '../../src/client/tilda-http-client.js';
import { deployClubhouseLanding, buildClubhouseMonolithicHtml } from '../../src/generators/clubhouse-builder.js';
import { CONFIG } from '../../src/config.js';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('🏛️ Запуск сборки архитектурной монографии клубного дома «Большая Полянка, 14»...');

  // 1. Generate local standalone preview
  const previewHtml = buildClubhouseMonolithicHtml();
  const previewPath = path.resolve(process.cwd(), 'preview_clubhouse.html');
  fs.writeFileSync(previewPath, previewHtml, 'utf-8');
  console.log(`✅ Локальное превью сохранено: ${previewPath} (${(previewHtml.length / 1024).toFixed(1)} KB)`);

  // 2. Deploy to live Tilda project
  const client = new TildaHttpClient();
  const projectId = CONFIG.TILDA_PROJECT_ID || '40607103';

  const startTime = Date.now();
  const result = await deployClubhouseLanding(
    client,
    projectId,
    'Большая Полянка, 14 — Клубный дом на 17 резиденций'
  );
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n======================================================');
  console.log(`🎉 Архитектурная монография успешно опубликована за ${elapsed}s!`);
  console.log(`📄 Page ID: ${result.page_id}`);
  console.log(`🔗 Ссылка: ${result.published_url}`);
  console.log(`🧱 Блоков T123 загружено: ${result.blocks_count}`);
  console.log('======================================================\n');
}

main().catch((err) => {
  console.error('❌ Ошибка публикации клубного дома:', err);
  process.exit(1);
});
