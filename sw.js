const CACHE_NAME = "novamind-v7";

self.addEventListener(
    "install",
    event => {
        self.skipWaiting();
    }
);

self.addEventListener(
    "activate",
    event => {

        event.waitUntil(
            caches.keys().then(keys =>
                Promise.all(
                    keys.map(key => {

                        if(
                            key !== CACHE_NAME
                        ){
                            return caches.delete(
                                key
                            );
                        }
                    })
                )
            )
        );

        self.clients.claim();
    }
);

self.addEventListener(
    "message",
    event => {

        if(
            event.data &&
            event.data.action ===
            "skipWaiting"
        ){
            self.skipWaiting();
        }
    }
);

self.addEventListener(
    "fetch",
    event => {

        event.respondWith(
            fetch(event.request)
            .catch(
                () =>
                caches.match(
                    event.request
                )
            )
        );
    }
);
