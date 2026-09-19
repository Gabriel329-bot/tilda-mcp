async function inspectLibraryData() {
  const r = await fetch('https://app.tildacdn.net/tfront/page-editor/t-page-all.min.js?v=v26090902');
  const js = await r.text();

  const idx = js.indexOf('ERROR! $tpls in not set');
  console.log('Snippet before ERROR! $tpls:');
  console.log(js.slice(idx - 300, idx + 100));
}

inspectLibraryData().catch(console.error);
