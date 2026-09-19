async function inspectEditorJs() {
  const r = await fetch('https://app.tildacdn.net/tfront/page-editor/t-page-all.min.js?v=v26090902');
  const js = await r.text();
  console.log('t-page-all.min.js length:', js.length);

  // Search for csrf occurrences
  const matches = [...js.matchAll(/.{0,40}csrf.{0,60}/gi)].map(m => m[0]);
  console.log('CSRF occurrences count:', matches.length);
  matches.slice(0, 15).forEach((m, i) => console.log(`${i + 1}: ${m}`));

  // Search for block/add
  const blockMatches = [...js.matchAll(/.{0,40}block\/add.{0,60}/gi)].map(m => m[0]);
  console.log('\nblock/add occurrences count:', blockMatches.length);
  blockMatches.forEach((m, i) => console.log(`${i + 1}: ${m}`));

  const fnMatch = js.match(/.{0,50}getCSRF[\s\S]{0,200}\}/);
  console.log('getCSRF definition:', fnMatch ? fnMatch[0] : 'not found');

  const addMatch = js.match(/.{0,100}comm:"addnewrecord"[\s\S]{0,250}\}/);
  console.log('addnewrecord call:', addMatch ? addMatch[0] : 'not found');
}

inspectEditorJs().catch(console.error);
