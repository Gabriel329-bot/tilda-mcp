import { chromium } from 'playwright';
import fs from 'fs';
import { STORAGE_STATE_PATH } from '../src/config.js';

async function extractTemplates() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: STORAGE_STATE_PATH });
  const page = await context.newPage();

  console.log('Navigating to editor...');
  await page.goto('https://tilda.ru/page/?pageid=253396603', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  const tpls = await page.evaluate(() => {
    const w = window as any;
    if (Array.isArray(w.$tpls)) {
      return w.$tpls.map((t: any) => ({
        id: t.id,
        cod: t.cod,
        title: t.title,
        type: t.type,
        subtype: t.subtype,
        descr: t.descr,
      }));
    }
    return null;
  });

  if (!tpls) {
    console.log('window.$tpls not found yet, clicking Add Block button in DOM to trigger library load...');
    await page.evaluate(() => {
      const btn = document.querySelector('.tp-record-new, .tp-btn-add, #mainmenu') as HTMLElement;
      if (btn) btn.click();
    });
    await page.waitForTimeout(3000);

    const tplsAfter = await page.evaluate(() => {
      const w = window as any;
      if (Array.isArray(w.$tpls)) {
        return w.$tpls.map((t: any) => ({
          id: t.id,
          cod: t.cod,
          title: t.title,
          type: t.type,
          subtype: t.subtype,
          descr: t.descr,
        }));
      }
      return null;
    });

    if (tplsAfter) {
      console.log(`Found ${tplsAfter.length} templates after trigger!`);
      processTemplates(tplsAfter);
    } else {
      console.log('window.$tpls is still null');
    }
  } else {
    console.log(`Found ${tpls.length} templates directly!`);
    processTemplates(tpls);
  }

  await browser.close();
}

function processTemplates(tpls: any[]) {
  fs.writeFileSync('storage/all-tpls.json', JSON.stringify(tpls, null, 2));
  console.log('Saved all templates to storage/all-tpls.json');

  const targets = ['CR30', 'FR104', 'NM01', 'BF204', 'FT101', 'CR01'];
  console.log('\n--- TARGET TEMPLATE LOOKUP ---');
  for (const t of targets) {
    const match = tpls.find((item: any) => item.cod === t);
    if (match) {
      console.log(`🎯 [${t}] -> tplid: "${match.id}", title: "${match.title}", type: "${match.type}"`);
    } else {
      console.log(`❌ [${t}] -> NOT FOUND BY COD. Searching by title/substring...`);
      const softMatches = tpls.filter((item: any) =>
        (item.cod && item.cod.includes(t)) ||
        (item.title && item.title.includes(t)) ||
        (item.id && item.id === t)
      );
      softMatches.forEach((sm: any) => console.log(`   Candidate: id=${sm.id}, cod=${sm.cod}, title=${sm.title}`));
    }
  }
}

extractTemplates().catch(console.error);
