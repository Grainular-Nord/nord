// Inline, anonymous page-view beacon. It is copied into the tracked site's
// document by the dashboard, so it deliberately has no external dependency.
(() => {
    if (navigator.globalPrivacyControl === true || navigator.webdriver) return;

    const script = document.currentScript;
    if (!(script instanceof HTMLScriptElement)) return;

    const key = script.dataset.site;
    const baseEndpoint = script.dataset.endpoint?.replace(/\/$/, '');
    if (!key || !baseEndpoint) return;

    const endpoint = `${baseEndpoint}/event`;
    const send = (path, referrer) => {
        const body = JSON.stringify({ key, path, referrer });
        if (!(navigator.sendBeacon && navigator.sendBeacon(endpoint, body))) {
            fetch(endpoint, { method: 'POST', body, keepalive: true, mode: 'no-cors' }).catch(() => {});
        }
    };

    const navigationApi = window.navigation;
    if (navigationApi) {
        navigationApi.addEventListener('navigate', (event) => {
            const path = new URL(event.destination.url).pathname;
            if (path !== location.pathname) queueMicrotask(() => send(path, null));
        });
    }

    send(location.pathname, document.referrer || null);
})();
