const cookieStr = 'TILDAUTM=utm_source%3Dgemini%7C%7C%7C; registered=yes; deviceid=3VaHrt; mainsite=tilda.cc; PHPSESSID=cs8mi4c2n3sucnghbrjdo90dcj; userid=37237203; hash=b3926d918b8870f63bd6eab8771aa495; lang=RU';

async function testDetect() {
  const url = 'https://tilda.cc/detectdomain/get/?redirect_url=https%3A%2F%2Ftilda.ru%2Fpage%2F%3Fpageid%3D253396603';
  const res = await fetch(url, {
    headers: {
      'Cookie': cookieStr,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    },
    redirect: 'manual',
  });
  console.log('detect status:', res.status);
  console.log('detect loc:', res.headers.get('location'));
  console.log('detect cookies:', res.headers.get('set-cookie'));
}

testDetect().catch(console.error);
