import { TildaHttpClient } from './src/driver/tilda-http-client.js';

async function testAddAndInspect() {
  const client = new TildaHttpClient({ humanLikePacing: false });
  await client.checkAuth();
  
  // Use our test page 253932009
  const pageId = '253932009';
  await client.initSession(pageId);

  // Try adding 2051 (PL402)
  console.log('Adding 2051 (PL402)...');
  const plRec = await client.addBlock(pageId, '2051');
  console.log('Added 2051, recordId:', plRec);

  // Try adding 2371 (TS400)
  console.log('Adding 2371 (TS400)...');
  const tsRec = await client.addBlock(pageId, '2371');
  console.log('Added 2371, recordId:', tsRec);

  // Try adding 605 (TS101N)
  console.log('Adding 605 (TS101N)...');
  const ts101Rec = await client.addBlock(pageId, '605');
  console.log('Added 605, recordId:', ts101Rec);

  // Get records and inspect their default HTML/data
  const records = await client.getPageRecords(pageId);
  for (const recId of [plRec, tsRec, ts101Rec]) {
    const r = records.find(x => x.id === recId || (x.html && x.html.includes(recId)));
    console.log(`\n--- Record ${recId} (tplId: ${r?.tplid}) ---`);
    if (r?.html) {
      console.log('HTML snippet:', r.html.slice(0, 500));
    }
  }

  // Also fetch edit form / fields for plRec and tsRec
  const plContent = await (client as any).request('/page/get/', {
    method: 'POST',
    body: new URLSearchParams({
      comm: 'getrecordcontent',
      pageid: pageId,
      recordid: plRec,
    }),
  });
  console.log('PL402 recordcontent keys:', Object.keys(await plContent.json()));

  const tsContent = await (client as any).request('/page/get/', {
    method: 'POST',
    body: new URLSearchParams({
      comm: 'getrecordcontent',
      pageid: pageId,
      recordid: tsRec,
    }),
  });
  console.log('TS400 recordcontent keys:', Object.keys(await tsContent.json()));
}

testAddAndInspect().catch(console.error);
