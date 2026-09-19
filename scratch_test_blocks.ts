import { TildaHttpClient } from './src/driver/tilda-http-client.js';

async function testBlocks() {
  const client = new TildaHttpClient({ humanLikePacing: false });
  await client.checkAuth();
  const pageId = '253932009';
  await client.initSession(pageId);

  // Add 1067 (PL100N)
  const rec1067 = await client.addBlock(pageId, '1067');
  console.log('1067 recId:', rec1067);

  // Add 528 (TS202)
  const rec528 = await client.addBlock(pageId, '528');
  console.log('528 recId:', rec528);

  // Add 533 (TS203)
  const rec533 = await client.addBlock(pageId, '533');
  console.log('533 recId:', rec533);

  const records = await client.getPageRecords(pageId);
  for (const [id, recId] of [['PL100N (1067)', rec1067], ['TS202 (528)', rec528], ['TS203 (533)', rec533]]) {
    const r = records.find(x => x.id === recId || (x.html && x.html.includes(recId)));
    console.log(`\n=== ${id} ===`);
    console.log(r?.html?.slice(0, 1000));
  }
}

testBlocks().catch(console.error);
