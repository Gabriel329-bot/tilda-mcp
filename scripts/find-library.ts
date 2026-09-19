async function findLibrary() {
  const r = await fetch('https://app.tildacdn.net/tfront/page-editor/t-page-all.min.js?v=v26090902');
  const js = await r.text();

  // Search for tp-library
  const matches = [...js.matchAll(/.{0,50}tp-library.{0,80}/gi)].map(m => m[0]);
  console.log('tp-library occurrences count:', matches.length);
  matches.slice(0, 10).forEach((m, i) => console.log(`${i + 1}: ${m}`));

  // Search for /page/ or /tpl/ or library url
  const urlMatches = [...js.matchAll(/url\s*:\s*['"]([^'"]*lib[^'"]*)['"]/gi)].map(m => m[1]);
  console.log('\nLib URLs in editor:', [...new Set(urlMatches)]);

  // Search for tplslist
  const tplsMatches = [...js.matchAll(/.{0,50}tplslist.{0,80}/gi)].map(m => m[0]);
  console.log('\ntplslist occurrences:', tplsMatches.slice(0, 5));
}

findLibrary().catch(console.error);
