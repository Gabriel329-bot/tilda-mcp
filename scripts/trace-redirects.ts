const cookieStr = 'TILDAUTM=utm_source%3Dgemini%7C%7C%7C; registered=yes; deviceid=3VaHrt; mainsite=tilda.cc; PHPSESSID=cs8mi4c2n3sucnghbrjdo90dcj; userid=37237203; hash=b3926d918b8870f63bd6eab8771aa495; lang=RU';

async function trace(url: string, hops = 0): Promise<void> {
  if (hops > 10) {
    console.log('STOPPED: more than 10 hops');
    return;
  }
  console.log(`[Hop ${hops}] GET ${url}`);
  const res = await fetch(url, {
    headers: {
      'Cookie': cookieStr,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    },
    redirect: 'manual',
  });
  console.log(`  -> Status: ${res.status}`);
  const loc = res.headers.get('location');
  console.log(`  -> Location: ${loc}`);
  const sc = res.headers.get('set-cookie');
  if (sc) console.log(`  -> Set-Cookie: ${sc.slice(0, 120)}...`);
  if (loc && (res.status === 301 || res.status === 302 || res.status === 303 || res.status === 307)) {
    const nextUrl = loc.startsWith('http') ? loc : new URL(loc, url).href;
    await trace(nextUrl, hops + 1);
  }
}

trace('https://tilda.cc/projects/').catch(console.error);
