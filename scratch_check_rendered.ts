import { TildaHttpClient } from './src/driver/tilda-http-client.js';

async function checkRenderedCards() {
  const client = new TildaHttpClient({ humanLikePacing: false });
  await client.checkAuth();
  const pageId = '253932009';
  const records = await client.getPageRecords(pageId);
  const r = records.find(x => x.id === '4045391601' || (x.html && x.html.includes('4045391601')));
  const html = r?.html || '';
  console.log('Includes LIGHT DETAILING:', html.includes('LIGHT DETAILING'));
  console.log('Includes FULL PROTECTION:', html.includes('FULL PROTECTION'));
  console.log('Includes STAGE 2 + TRACK:', html.includes('STAGE 2 + TRACK'));
  console.log('Includes 45 000:', html.includes('45 000'));
  console.log('Includes 180 000:', html.includes('180 000'));
  console.log('Includes 290 000:', html.includes('290 000'));
}

checkRenderedCards().catch(console.error);
