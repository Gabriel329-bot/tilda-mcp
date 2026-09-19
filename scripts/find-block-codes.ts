async function findBlockCodes() {
  const r = await fetch('https://app.tildacdn.net/tfront/page-editor/t-page-all.min.js?v=v26090902');
  const js = await r.text();

  const codes = ['CR30', 'FR104', 'NM01', 'BF204', 'FT101', 'CR01', 'T123'];
  for (const c of codes) {
    const idx = js.indexOf(c);
    console.log(`Code ${c} in editor JS:`, idx !== -1 ? `found at ${idx}` : 'not found');
    if (idx !== -1) {
      console.log(`  Snippet:`, js.slice(idx - 50, idx + 100));
    }
  }
}

findBlockCodes().catch(console.error);
