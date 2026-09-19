async function inspectGetPage() {
  const r = await fetch('https://app.tildacdn.net/tfront/page-editor/t-page-all.min.js?v=v26090902');
  const js = await r.text();

  const idx = js.indexOf('url:"/page/get/getpage/"');
  console.log('Snippet around url:"/page/get/getpage/":');
  console.log(js.slice(idx - 200, idx + 200));
}

inspectGetPage().catch(console.error);
