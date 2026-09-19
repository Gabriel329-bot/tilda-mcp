import { TildaHttpClient } from './src/driver/tilda-http-client.js';

async function findNativeBlocks() {
  const client = new TildaHttpClient({ humanLikePacing: false });
  await client.checkAuth();
  
  const res = await (client as any).request('/page/tplslistjs/', { method: 'GET' });
  const text = await res.text();
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  const tpls: any[] = JSON.parse(text.slice(start, end + 1));

  console.log('--- NATIVE PRICING BLOCKS (not Zero Block 396) ---');
  const nativePl = tpls.filter(t => 
    t.cod && (t.cod.startsWith('PL') || t.cod.startsWith('PR')) && 
    t.parenttplid !== '396' && t.type !== '12' &&
    (/price|pric|тариф|карточк/i.test(t.title) || /price|pric|тариф/i.test(t.descr))
  );
  nativePl.forEach(t => console.log(`id: ${t.id}, cod: ${t.cod}, title: ${t.title}, type: ${t.type}, parent: ${t.parenttplid}`));

  console.log('\n--- NATIVE REVIEWS BLOCKS (not Zero Block 396) ---');
  const nativeTs = tpls.filter(t => 
    t.cod && t.cod.startsWith('TS') && 
    t.parenttplid !== '396' && t.type !== '12'
  );
  nativeTs.forEach(t => console.log(`id: ${t.id}, cod: ${t.cod}, title: ${t.title}, type: ${t.type}, parent: ${t.parenttplid}`));
}

findNativeBlocks().catch(console.error);
