async function checkAllAnchors() {
  const res = await fetch('https://polish-clumsy-carp.tilda.ws/page253938009.html');
  const html = await res.text();
  
  for (const name of ['features', 'metrics', 'pricing', 'reviews', 'faq', 'form']) {
    let count = 0;
    let pos = 0;
    const matches: string[] = [];
    while ((pos = html.indexOf(name, pos)) !== -1) {
      count++;
      matches.push(html.slice(Math.max(0, pos - 50), Math.min(html.length, pos + 100)));
      pos += name.length;
    }
    console.log(`\n=== "${name}": ${count} occurrences ===`);
    matches.slice(0, 3).forEach((m, idx) => console.log(`  [${idx + 1}] ...${m.replace(/\n/g, ' ')}...`));
  }
}
checkAllAnchors();
