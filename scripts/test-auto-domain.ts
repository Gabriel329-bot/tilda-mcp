import fs from 'fs';

async function testAutoDomain() {
  const state = JSON.parse(fs.readFileSync('storage/storage_state.json', 'utf8'));
  let cookieStr = state.cookies.map((c: any) => `${c.name}=${c.value}`).join('; ');
  if (!cookieStr.includes('PHPSESSID')) {
    cookieStr += '; PHPSESSID=h7f0qo5ek3h6nq26cfg9mqkk9a';
  }

  for (const domain of ['https://tilda.cc', 'https://tilda.ru']) {
    console.log(`\nChecking ${domain}/projects/...`);
    const r = await fetch(`${domain}/projects/`, {
      headers: {
        'Cookie': cookieStr,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
      },
      redirect: 'manual',
    });

    console.log(`${domain} status:`, r.status, 'location:', r.headers.get('location'));
    if (r.status === 200) {
      console.log(`SUCCESS! Authenticated domain is: ${domain}`);

      // Test page 253396603
      console.log(`Checking ${domain}/page/?pageid=253396603...`);
      const pr = await fetch(`${domain}/page/?pageid=253396603`, {
        headers: {
          'Cookie': cookieStr,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
        },
        redirect: 'manual',
      });
      console.log(`Page status:`, pr.status, 'location:', pr.headers.get('location'));
      const pText = await pr.text();
      console.log('Page HTML length:', pText.length);
    }
  }
}

testAutoDomain().catch(console.error);
