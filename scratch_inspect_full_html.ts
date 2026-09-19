import { TildaHttpClient } from './src/driver/tilda-http-client.js';

async function inspectHtml() {
  const client = new TildaHttpClient({ humanLikePacing: false });
  await client.checkAuth();
  const pageId = '253932009';
  const records = await client.getPageRecords(pageId);

  const r1067 = records.find(x => x.id === '4045389901' || (x.html && x.html.includes('4045389901')));
  console.log('=== FULL PL100N HTML ===');
  console.log(r1067?.html);

  const r533 = records.find(x => x.id === '4045390101' || (x.html && x.html.includes('4045390101')));
  console.log('=== FULL TS203 HTML ===');
  console.log(r533?.html);
}

inspectHtml().catch(console.error);
