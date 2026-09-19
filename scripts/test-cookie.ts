const cookieStr = 'TILDAUTM=utm_source%3Dgemini%7C%7C%7C; registered=yes; deviceid=3VaHrt; mainsite=tilda.cc; PHPSESSID=cs8mi4c2n3sucnghbrjdo90dcj; userid=37237203; hash=b3926d918b8870f63bd6eab8771aa495; lang=RU';

async function main() {
  const urls = [
    'https://tilda.cc/projects/',
    'https://tilda.cc/page/?pageid=253396603',
    'https://tilda.ru/page/?pageid=253396603',
  ];

  for (const url of urls) {
    console.log(`\nTesting: ${url}`);
    const res = await fetch(url, {
      headers: {
        'Cookie': cookieStr,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
        'Sec-Ch-Ua': '"Brave";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
      },
      redirect: 'manual',
    });

    console.log('Status:', res.status);
    console.log('Location:', res.headers.get('location'));
    console.log('Set-Cookie:', res.headers.get('set-cookie'));
    const text = await res.text();
    console.log('Body length:', text.length);
    if (res.status === 200) {
      console.log('Title match:', text.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim());
      const csrf = text.match(/name=["']csrf["'][^>]*content=["']([^"']*)["']/i)?.[1];
      console.log('CSRF found:', csrf);
    }
  }
}

main().catch(console.error);
