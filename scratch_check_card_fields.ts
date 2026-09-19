import { TildaHttpClient } from './src/driver/tilda-http-client.js';

async function listRecords() {
  const client = new TildaHttpClient({ humanLikePacing: false });
  await client.checkAuth();
  const pageId = '253932009';
  const records = await client.getPageRecords(pageId);
  for (const r of records) {
    const id = r.id || (r.html ? (r.html.match(/recordid=["'](\d+)["']/) || [])[1] : 'unknown');
    console.log(`id: ${id}, tplid: ${r.tplid}`);
    if (r.html && (r.html.includes('1067') || r.html.includes('533') || r.html.includes('528'))) {
      console.log('HTML slice:', r.html.slice(0, 1000));
    }
  }
}

listRecords().catch(console.error);
