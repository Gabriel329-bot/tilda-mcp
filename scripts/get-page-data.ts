import fs from 'fs';

async function getPageData() {
  const state = JSON.parse(fs.readFileSync('storage/storage_state.json', 'utf8'));
  const cookieStr = state.cookies.map((c: any) => `${c.name}=${c.value}`).join('; ');
  const PAGE_ID = '253396603';

  const payload = new URLSearchParams({
    pageid: PAGE_ID,
  });

  const res = await fetch('https://tilda.ru/page/get/getpage/', {
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

  console.log('Status:', res.status);
  const data = await res.json();
  console.log('Page Title:', data.title);
  console.log('Project ID:', data.projectid);
  console.log('Records count:', data.records?.length || 0);

  if (Array.isArray(data.records)) {
    data.records.forEach((r: any, i: number) => {
      console.log(`\n[${i + 1}] Record ID: ${r.id || r.recordid}, COD: ${r.cod}, Type: ${r.tplid || r.type}`);
      console.log(`    Title: ${r.title || r.rec_title || '<none>'}`);
      console.log(`    Fields:`, Object.keys(r.fields || r.data || r));
    });
  }

  fs.writeFileSync('storage/current-records.json', JSON.stringify(data, null, 2));
  console.log('\nSaved full page data to storage/current-records.json');
}

getPageData().catch(console.error);
