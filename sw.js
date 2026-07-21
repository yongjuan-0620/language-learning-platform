const CACHE_NAME = 'language-learning-platform-v3';
const OFFLINE_URL = 'index.html';

const PRECACHE_URLS = [
    './',
    'index.html',
    'css/style.css',
    'js/data.js',
    'js/main.js',
    'manifest.json'
];

self.addEventListener('install', (event) => {
    // 先清除所有旧缓存
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => caches.delete(name))
            );
        }).then(() => {
            return caches.open(CACHE_NAME);
        }).then((cache) => {
            return cache.addAll(PRECACHE_URLS);
        })
        .catch((error) => {
            console.log('Pre-cache failed:', error);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// 强制网络优先（避免旧代码缓存）
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    if (request.method !== 'GET') {
        return;
    }

    // 对JS/CSS/HTML文件使用 network-first 策略，确保获取最新版本
    const isAssetFile = /\.(js|css|html|json)$/.test(url.pathname);
    if (isAssetFile || request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response && response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseClone);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    return caches.match(request).then((cachedResponse) => {
                        if (cachedResponse) return cachedResponse;
                        if (request.mode === 'navigate') {
                            return caches.match(OFFLINE_URL);
                        }
                        return new Response('Offline', { status: 408 });
                    });
                })
        );
        return;
    }

    // 其他资源使用 cache-first
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    fetch(request)
                        .then((networkResponse) => {
                            if (networkResponse && networkResponse.status === 200) {
                                const responseClone = networkResponse.clone();
                                caches.open(CACHE_NAME).then((cache) => {
                                    cache.put(request, responseClone);
                                });
                            }
                        })
                        .catch(() => {});
                    return cachedResponse;
                }

                return fetch(request)
                    .then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            const responseClone = networkResponse.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(request, responseClone);
                            });
                        }
                        return networkResponse;
                    })
                    .catch(() => {
                        return new Response('Offline', { status: 408 });
                    });
            })
    );
});