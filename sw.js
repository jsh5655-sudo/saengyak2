// 생약학2 오프라인 캐시 — 내용 바꿀 때 버전 올리기
const V='saengyak2-v17';
const CORE=['./','index.html','manifest.json','icon-192.png','icon-512.png','apple-touch-icon.png','favicon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  // 페이지·파일: 네트워크 먼저(새 생약 반영), 안 되면 캐시
  if(u.origin===location.origin){
    e.respondWith(fetch(r.url,{cache:'no-cache'}).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put(r,c));return res}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));
  // 글꼴: 캐시 먼저
  }else if(/fonts\.(googleapis|gstatic)\.com/.test(u.host)){
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put(r,c));return res})));
  }
});
