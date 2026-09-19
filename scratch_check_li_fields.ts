import { TildaHttpClient } from './src/driver/tilda-http-client.js';

async function checkLiFields() {
  const client = new TildaHttpClient({ humanLikePacing: false });
  await client.checkAuth();
  const pageId = '253932009';
  const records = await client.getPageRecords(pageId);

  const r1067 = records.find(x => x.html && x.html.includes('4045389901'));
  console.log('--- PL100N (1067) li fields in HTML ---');
  const liMatches1067 = r1067?.html?.match(/field=["'](li_[^"']+)["']/g) || [];
  console.log('PL100N li fields:', Array.from(new Set(liMatches1067)));

  const r533 = records.find(x => x.html && x.html.includes('4045390101'));
  console.log('\n--- TS203 (533) li fields in HTML ---');
  const liMatches533 = r533?.html?.match(/field=["'](li_[^"']+)["']/g) || [];
  console.log('TS203 li fields:', Array.from(new Set(liMatches533)));

  const r605 = records.find(x => x.html && x.html.includes('4045389001'));
  console.log('\n--- TS101N (605) li fields in HTML ---');
  const liMatches605 = r605?.html?.match(/field=["'](li_[^"']+)["']/g) || [];
  console.log('TS101N li fields:', Array.from(new Set(liMatches605)));

  const r528 = records.find(x => x.html && x.html.includes('4045390001'));
  console.log('\n--- TS202 (528) li fields in HTML ---');
  const liMatches528 = r528?.html?.match(/field=["'](li_[^"']+)["']/g) || [];
  console.log('TS202 li fields:', Array.from(new Set(liMatches528)));
}

checkLiFields().catch(console.error);
