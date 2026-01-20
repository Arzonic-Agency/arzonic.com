// Service Worker for Push Notifications
const SW_VERSION = "2.1.0";

self.addEventListener("install", () => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener("push", (event) => {
    let data;
    try {
        data = event.data ? event.data.json() : { title: "Ny besked", body: "" };
    } catch {
        data = { title: "Ny besked", body: "" };
    }

    const options = {
        body: data.body,
        icon: "/icon-192x192.png",
        badge: "/icon-192x192.png",
        tag: data.tag || "default",
        requireInteraction: false,
        vibrate: [200, 100, 200],
        data: {
            url: data.url || "/admin/messages",
            requestId: data.requestId || null,
        },
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    const notificationData = event.notification.data || {};
    let targetUrl = notificationData.url || "/admin/messages";

    // Hvis der er et requestId, tilføj det som query parameter
    if (notificationData.requestId) {
        targetUrl = `/admin/messages?requestId=${notificationData.requestId}`;
    }

    event.waitUntil(
        clients
            .matchAll({ type: "window", includeUncontrolled: true })
            .then((clientList) => {
                // Find et eksisterende vindue med admin
                for (const client of clientList) {
                    if (client.url.includes("/admin") && "focus" in client) {
                        // Naviger til den specifikke henvendelse
                        client.navigate(targetUrl);
                        return client.focus();
                    }
                }
                // Ellers åbn et nyt vindue med den specifikke URL
                if (clients.openWindow) {
                    return clients.openWindow(targetUrl);
                }
            })
    );
});
