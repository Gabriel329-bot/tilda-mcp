import { TildaHttpClient } from './src/driver/tilda-http-client.js';

async function checkPricingCandidates() {
  const client = new TildaHttpClient({ humanLikePacing: false });
  await client.checkAuth();
  const pageId = '253932009';
  await client.initSession(pageId);

  for (const tpl of ['1072', '1073', '612', '2031', '3351']) {
    try {
      const recId = await client.addBlock(pageId, tpl);
      console.log(`Added tpl ${tpl}, recId: ${recId}`);
    } catch (e: any) {
      console.log(`Failed tpl ${tpl}: ${e.message}`);
    }
  }

  const records = await client.getPageRecords(pageId);
  for (const tpl of ['1072', '1073', '612', '2031', '3351']) {
    const r = records.find(x => x.tplid === tpl || (x.html && x.html.includes(`data-record-type="${tpl}"`)));
    if (r) {
      const liMatches = r.html?.match(/field=["'](li_[^"']+)["']/g) || [];
      console.log(`\nTpl ${tpl} fields:`, Array.from(new Set(liMatches)));
      console.log(`Tpl ${tpl} html title snippet:`, r.html?.match(/<div[^>]*class="[^"]*title[^"]*"[^>]*>[\s\S]*?<\/div>/i)?.[0]);
    }
  }
}

checkPricingCandidates().catch(console.error);
