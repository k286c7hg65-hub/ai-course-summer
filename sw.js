// AI 夏令营 PWA Service Worker (upgrade3)
const CACHE = 'ai-course-v1';
const CORE = [
  './',
  './index.html',
  './guide.html',
  './knowledge-deck.html',
  './manifest.webmanifest',
  './icon.svg',
  './pages/lesson1-turing-judge.html',
  './pages/lesson2-timeline.html',
  './pages/lesson3-gradient-descent.html',
  './pages/lesson4-neural-network.html',
  './pages/lesson5-convolution-doodle.html',
  './pages/lesson6-llm-viz.html',
  './pages/lesson7-industry-heatmap.html',
  './pages/lesson8-supply-chain.html',
  './pages/lesson9-investment-machine.html',
  './pages/lesson10-ai-minister.html',
  './pages/lesson11-ethics-cards.html',
  './pages/lesson12-concept-map.html'
];
self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(CORE); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request).then(function(hit){
      if (hit) return hit;
      return fetch(e.request).then(function(res){
        var copy = res.clone();
        caches.open(CACHE).then(function(c){ c.put(e.request, copy); }).catch(function(){});
        return res;
      }).catch(function(){ return caches.match('./index.html'); });
    })
  );
});
