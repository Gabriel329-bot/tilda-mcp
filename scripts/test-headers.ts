const cookieStr = 'TILDAUTM=utm_source%3Dgemini%7C%7C%7C; registered=yes; deviceid=3VaHrt; mainsite=tilda.cc; PHPSESSID=cs8mi4c2n3sucnghbrjdo90dcj; userid=37237203; hash=b3926d918b8870f63bd6eab8771aa495; lang=RU';

async function testWithHeaders() {
  const res = await fetch('https://tilda.cc/projects/', {
    headers: {
      'Host': 'tilda.cc',
      'Cookie': cookieStr,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
      'Referer': 'https://tilda.cc/login/',
      'Sec-Ch-Ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'same-origin',
      'Upgrade-Insecure-Requests': '1',
    },
    redirect: 'manual',
  });

  console.log('Status:', res.status);
  console.log('Location:', res.headers.get('location'));
  console.log('Set-Cookie:', res.headers.get('set-cookie'));
  const text = await res.text();
  console.log('Text length:', text.length);
}

testWithHeaders().catch(console.error);
