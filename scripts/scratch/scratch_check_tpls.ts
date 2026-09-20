import { TildaHttpClient } from '../../src/client/tilda-http-client.js';

async function checkIds() {
  const client = new TildaHttpClient({ humanLikePacing: false });
  await client.checkAuth();
  
  const res = await (client as any).request('/page/tplslistjs/', { method: 'GET' });
  const text = await res.text();
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  const tpls: any[] = JSON.parse(text.slice(start, end + 1));

  const t301 = tpls.find(t => t.id === '301');
  console.log('ID 301:', t301);

  const t441 = tpls.find(t => t.id === '441');
  console.log('ID 441:', t441);

  // Check all templates with cod PL400, PL402, TS101, TS203, TS400
  console.log('PL402:', tpls.find(t => t.cod === 'PL402'));
  console.log('TS101N:', tpls.find(t => t.cod === 'TS101N'));
  console.log('TS203:', tpls.find(t => t.cod === 'TS203'));
  console.log('TS400:', tpls.find(t => t.cod === 'TS400'));
}

checkIds().catch(console.error);
