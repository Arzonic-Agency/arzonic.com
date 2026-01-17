// Service Worker for Push Notifications
self.addEventListener("push", (event) => {
    const data = event.data ? event.data.json() : { title: "Ny besked", body: "" };

    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: "/icon-192x192.png",
            badge: "/icon-192x192.png",
            tag: data.tag || "default",
            requireInteraction: false,
        })
    );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(
        clients
            .matchAll({ type: "window", includeUncontrolled: true })
            .then((clientList) => {
                // Hvis der allerede er et åbent vindue, fokusér på det
                for (const client of clientList) {
                    if (client.url === "/" && "focus" in client) {
                        return client.focus();
                    }
                }
                // Ellers åbn et nyt vindue
                if (clients.openWindow) {
                    return clients.openWindow("/");
                }
            })
    );
});