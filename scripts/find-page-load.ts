async function findPageLoad() {
  const r = await fetch('https://app.tildacdn.net/tfront/page-editor/t-page-all.min.js?v=v26090902');
  const js = await r.text();

  // Search for how records are fetched / loaded on page load
  const matches = [...js.matchAll(/comm\s*:\s*['"]([a-z0-9_]+)['"]/gi)].map(m => m[1]);
  console.log('All comm commands in editor:', [...new Set(matches)]);

  // Search for getrecords or loadrecords or getpage
  const getRecMatches = [...js.matchAll(/.{0,40}(?:getrecords|loadrecords|getpagerecords|getpage).{0,60}/gi)].map(m => m[0]);
  console.log('\nGet/load matches:', getRecMatches.slice(0, 10));

  // Search for deleterecord
  const delMatches = [...js.matchAll(/.{0,40}deleterecord.{0,60}/gi)].map(m => m[0]);
  console.log('\nDelete matches:', delMatches.slice(0, 10));
}

findPageLoad().catch(console.error);
