import fs from 'fs';

async function main() {
  const state = JSON.parse(fs.readFileSync('storage/storage_state.json', 'utf8'));
  const cookieHeader = state.cookies.map((c: any) => `${c.name}=${c.value}`).join('; ');

  const r = await fetch('https://tilda.ru/page/?pageid=253396603', {
    headers: {
      'Cookie': cookieHeader,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    },
    redirect: 'manual',
  });

  console.log('page 253396603 on tilda.ru status:', r.status);
  console.log('location:', r.headers.get('location'));
  const text = await r.text();
  console.log('length:', text.length);

  const metaMatch =
    text.match(/<meta[^>]*name=["']csrf["'][^>]*content=["']([^"']*)["']/i) ||
    text.match(/id=["']csrf["'][^>]*content=["']([^"']*)["']/i) ||
    text.match(/content=["']([^"']*)["'][^>]*id=["']csrf["']/i);
  const jsMatch =
    text.match(/window\.tildaCsrf\s*=\s*['"]([^'"]+)['"]/i) ||
    text.match(/window\.csrf\s*=\s*['"]([^'"]+)['"]/i) ||
    text.match(/csrf\s*[:=]\s*['"]([a-f0-9]{16,64})['"]/i);

  console.log('meta CSRF:', metaMatch ? metaMatch[1] : 'none');
  console.log('js CSRF:', jsMatch ? jsMatch[1] : 'none');
  console.log('Title:', text.match(/<title>([^<]+)<\/title>/i)?.[1]);

  // Check what pages exist in project
  const pr = await fetch('https://tilda.ru/projects/', {
    headers: {
      'Cookie': cookieHeader,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    },
  });
  const prText = await pr.text();
  const pages = [...prText.matchAll(/pageid=(\d+)/g)].map(m => m[1]);
  console.log('All pages in account:', [...new Set(pages)]);
  const projects = [...prText.matchAll(/projectid=(\d+)/g)].map(m => m[1]);
  console.log('All projects in account:', [...new Set(projects)]);
}

main().catch(console.error);
