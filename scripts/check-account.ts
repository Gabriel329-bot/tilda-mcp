import fs from 'fs';

async function check() {
  const state = JSON.parse(fs.readFileSync('storage/storage_state.json', 'utf8'));
  const cookies = state.cookies.map((c: any) => `${c.name}=${c.value}`).join('; ');
  console.log('Cookies loaded:', state.cookies.length);
  for (const c of state.cookies) {
    console.log(`  ${c.domain} | ${c.name} = ${c.value.slice(0, 10)}...`);
  }

  // Try both tilda.cc and tilda.ru
  for (const domain of ['https://tilda.cc', 'https://tilda.ru']) {
    console.log(`\n--- Fetching ${domain}/projects/ ---`);
    const r = await fetch(`${domain}/projects/`, {
      headers: {
        'Cookie': cookies,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      },
      redirect: 'manual',
    });
    console.log(`Status: ${r.status}`);
    const loc = r.headers.get('location');
    if (loc) console.log(`Location: ${loc}`);
    const text = await r.text();
    console.log(`HTML size: ${text.length}`);

    const projectMatches = [...text.matchAll(/projectid=(\d+)/gi)].map(m => m[1]);
    console.log('Project IDs found:', [...new Set(projectMatches)]);

    // Check project links and page links
    const pageMatches = [...text.matchAll(/pageid=(\d+)/gi)].map(m => m[1]);
    console.log('Page IDs found:', [...new Set(pageMatches)]);

    // Check if target page 253396603 exists anywhere in HTML
    if (text.includes('253396603')) {
      console.log('FOUND 253396603 in /projects/ HTML!');
    }

    // If we have projects, let's fetch each project page to see its pages
    const uniqueProjects = [...new Set(projectMatches)];
    for (const pid of uniqueProjects) {
      console.log(`\nFetching project details: ${domain}/projects/?projectid=${pid}`);
      const pr = await fetch(`${domain}/projects/?projectid=${pid}`, {
        headers: {
          'Cookie': cookies,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        },
        redirect: 'manual',
      });
      console.log(`Project ${pid} status: ${pr.status}`);
      const prLoc = pr.headers.get('location');
      if (prLoc) console.log(`Project ${pid} location: ${prLoc}`);
      const prText = await pr.text();
      const pages = [...prText.matchAll(/pageid=(\d+)/gi)].map(m => m[1]);
      console.log(`Pages in project ${pid}:`, [...new Set(pages)]);
      
      if (prText.includes('253396603')) {
        console.log(`FOUND 253396603 in project ${pid}!`);
      }

      // Check subdomain
      const subMatch = prText.match(/https?:\/\/([a-z0-9\-]+)\.tilda\.ws/i);
      if (subMatch) console.log(`Subdomain: ${subMatch[0]}`);
    }
  }
}

check().catch(console.error);
