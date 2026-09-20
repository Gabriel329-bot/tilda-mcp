import { TildaHttpClient } from '../../src/client/tilda-http-client.js';

async function print1072() {
  const client = new TildaHttpClient({ humanLikePacing: false });
  await client.checkAuth();
  const pageId = '253932009';
  const records = await client.getPageRecords(pageId);
  const r1072 = records.find(x => x.tplid === '1072' || (x.html && x.html.includes('data-record-type="1072"')));
  console.log('=== 1072 HTML ===');
  console.log(r1072?.html);
}

print1072().catch(console.error);
