import fs from 'fs';

const html = fs.readFileSync('storage/page-253396603.html', 'utf8');
const lines = html.split('\n');
console.log('Total lines:', lines.length);

lines.forEach((l, i) => {
  if (l.toLowerCase().includes('csrf') || l.toLowerCase().includes('token') || l.toLowerCase().includes('window.')) {
    console.log(`Line ${i + 1}: ${l}`);
  }
});

// Let's also check all script tags in html
const scriptMatches = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)];
console.log('\nScript tags count:', scriptMatches.length);
scriptMatches.forEach((m, i) => {
  console.log(`\n--- Script ${i + 1} ---`);
  console.log(m[1].slice(0, 300));
});
