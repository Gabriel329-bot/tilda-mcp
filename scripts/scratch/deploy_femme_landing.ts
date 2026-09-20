import { TildaHttpClient } from '../../src/client/tilda-http-client.js';
import { deployFemmeCourseLanding, buildFemmeMonolithicHtml } from '../../src/generators/femme-builder.js';
import { CONFIG } from '../../src/config.js';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('🌸 Запуск генерации и публикации премиального лендинга Femme Sculpt...');

  // 1. Generate local standalone preview
  const previewHtml = buildFemmeMonolithicHtml();
  const previewPath = path.resolve(process.cwd(), 'preview_femme.html');
  fs.writeFileSync(previewPath, previewHtml, 'utf-8');
  console.log(`✅ Локальное превью сохранено: ${previewPath} (${(previewHtml.length / 1024).toFixed(1)} KB)`);

  // 2. Deploy to live Tilda project
  const client = new TildaHttpClient();
  const projectId = CONFIG.TILDA_PROJECT_ID || '40607103';

  const startTime = Date.now();
  const result = await deployFemmeCourseLanding(
    client,
    projectId,
    'Femme Sculpt — Осознанный пилатес, осанка и сильный кор'
  );
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n======================================================');
  console.log(`🎉 Лендинг успешно опубликован за ${elapsed}s!`);
  console.log(`📄 Page ID: ${result.page_id}`);
  console.log(`🔗 Ссылка: ${result.published_url}`);
  console.log(`🧱 Блоков загружено: ${result.blocks_count}`);
  console.log('======================================================\n');
}

main().catch((err) => {
  console.error('❌ Ошибка деплоя:', err);
  process.exit(1);
});
