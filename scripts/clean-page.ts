import fs from 'fs';

async function cleanPage() {
  const state = JSON.parse(fs.readFileSync('storage/storage_state.json', 'utf8'));
  const cookieStr = state.cookies.map((c: any) => `${c.name}=${c.value}`).join('; ');
  const PAGE_ID = '253396603';

  // 1. Get all current records
  const gRes = await fetch('https://tilda.ru/page/get/getpage/', {
    method: 'POST',
    headers: {
      'Cookie': cookieStr,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: new URLSearchParams({ pageid: PAGE_ID }),
  });
  const data = await gRes.json();
  const recs = data.records || [];
  console.log(`Current records to delete count: ${recs.length}`);

  for (const r of recs) {
    const id = r.html?.match(/recordid=["'](\d+)["']/)?.[1];
    if (!id) continue;
    console.log(`Deleting record id: ${id}`);
    const delRes = await fetch('https://tilda.ru/page/submit/', {
      method: 'POST',
      headers: {
        'Cookie': cookieStr,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: new URLSearchParams({
        comm: 'deleterecord',
        pageid: PAGE_ID,
        recordid: id,
      }),
    });
    const txt = await delRes.text();
    console.log(`Deleted: ${id}, status: ${delRes.status}, result: ${txt}`);
  }

  // 2. Verify
  const vRes = await fetch('https://tilda.ru/page/get/getpage/', {
    method: 'POST',
    headers: {
      'Cookie': cookieStr,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: new URLSearchParams({ pageid: PAGE_ID }),
  });
  const vData = await vRes.json();
  console.log(`Records remaining on page ${PAGE_ID}: ${vData.records?.length || 0}`);
}

cleanPage().catch(console.error);
