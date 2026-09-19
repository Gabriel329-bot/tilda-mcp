import fs from 'fs';

async function inspectAndClean() {
  const state = JSON.parse(fs.readFileSync('storage/storage_state.json', 'utf8'));
  const cookieStr = state.cookies.map((c: any) => `${c.name}=${c.value}`).join('; ');
  const PAGE_ID = '253396603';

  console.log(`Fetching page ${PAGE_ID}...`);
  const r = await fetch(`https://tilda.ru/page/?pageid=${PAGE_ID}`, {
    headers: {
      'Cookie': cookieStr,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    },
  });

  const html = await r.text();
  console.log('HTML length:', html.length);

  // Extract records
  const recMatches = [...html.matchAll(/id=["']record(\d+)["'][^>]*data-record-cod=["']([^"']*)["'][^>]*data-record-type=["']([^"']*)["']/gi)];
  console.log(`Found ${recMatches.length} records by full pattern:`);
  for (const m of recMatches) {
    console.log(`  Record ID: ${m[1]} | COD: ${m[2]} | Type/TPL: ${m[3]}`);
  }

  // Also search all recordid occurrences
  const allRecIds = [...new Set([...html.matchAll(/recordid=["'](\d+)["']/gi)].map(m => m[1]))];
  console.log('All record IDs on page:', allRecIds);

  // Step 1: Clean the page by deleting all records
  console.log('\n--- Cleaning page (deleting all records) ---');
  for (const recId of allRecIds) {
    console.log(`Deleting record ${recId}...`);
    const payload = new URLSearchParams({
      comm: 'deleterecord',
      pageid: PAGE_ID,
      recordid: recId,
      commondomain: 'tilda.ru',
    });

    const delRes = await fetch('https://tilda.ru/page/submit/', {
      method: 'POST',
      headers: {
        'Cookie': cookieStr,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        'Origin': 'https://tilda.ru',
        'Referer': `https://tilda.ru/page/?pageid=${PAGE_ID}`,
      },
      body: payload,
    });

    const resText = await delRes.text();
    console.log(`  Delete response for ${recId}: status ${delRes.status}, result: ${resText.slice(0, 100)}`);
  }

  console.log('\nPage cleaning completed!');
}

inspectAndClean().catch(console.error);
