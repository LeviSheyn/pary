// При каждой правке поднимать V, чтобы обновился кэш
const V='pary-10',F=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable.png',...['cyrillic','hebrew','latin'].flatMap(s=>[400,500,700].map(w=>`rubik-${s}-${w}.woff2`))];
self.oninstall=e=>{self.skipWaiting();e.waitUntil(caches.open(V).then(c=>c.addAll(F)))};
self.onactivate=e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
// Страница: сначала сеть (свежие правки), без сети из кэша. Остальное: из кэша.
self.onfetch=e=>{
	const r=e.request;
	if(r.mode=='navigate')e.respondWith(fetch(r).then(x=>{const y=x.clone();caches.open(V).then(c=>c.put('index.html',y));return x}).catch(()=>caches.match('index.html')));
	else e.respondWith(caches.match(r).then(x=>x||fetch(r)));
};
