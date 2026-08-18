// ==UserScript==
// @name         DK Timer Client
// @namespace    local.dk.timer
// @version      0.1.0
// @author       IcyWhiteWolf
// @description  Public DK Timer UI client. Premium planner logic lives in the private API.
// @match        https://*.divokekmeny.sk/game.php*
// @match        https://*.divokekmeny.cz/game.php*
// @match        https://*.tribalwars.net/game.php*
// @match        https://*.tribalwars.com/game.php*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @connect      dk-timer-api.vercel.app
// ==/UserScript==

(function () {
    "use strict";

    const API_BASE = "https://dk-timer-api.vercel.app";
    const LICENSE_KEY_STORAGE = "dkTimerLicenseKey";
    const LICENSE_TOKEN_STORAGE = "dkTimerLicenseToken";

    function requestJson(path, payload, token) {
        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: "POST",
                url: `${API_BASE}${path}`,
                headers: Object.assign({
                    "Content-Type": "application/json"
                }, token ? {
                    Authorization: `Bearer ${token}`
                } : {}),
                data: JSON.stringify(payload || {}),
                onload: function (response) {
                    let body;

                    try {
                        body = JSON.parse(response.responseText || "{}");
                    } catch (error) {
                        reject(new Error("API vratilo neplatny JSON."));
                        return;
                    }

                    if (response.status < 200 || response.status >= 300 || !body.ok) {
                        reject(new Error(body.error || `API chyba ${response.status}`));
                        return;
                    }

                    resolve(body);
                },
                onerror: function () {
                    reject(new Error("API request zlyhal."));
                }
            });
        });
    }

    async function checkLicense(licenseKey) {
        const result = await requestJson("/api/license/check", {
            licenseKey: licenseKey
        });

        localStorage.setItem(LICENSE_KEY_STORAGE, licenseKey);
        localStorage.setItem(LICENSE_TOKEN_STORAGE, result.token);
        return result;
    }

    function renderLicensePanel() {
        if (document.getElementById("dkTimerLicensePanel")) {
            return;
        }

        const host = document.getElementById("content_value") || document.body;
        const panel = document.createElement("div");
        panel.id = "dkTimerLicensePanel";
        panel.style.margin = "8px 0";
        panel.innerHTML = `
            <div class="vis" style="display:inline-block;padding:8px">
                <strong>DK Timer</strong>
                <input id="dkTimerLicenseInput" value="${escapeHtml(localStorage.getItem(LICENSE_KEY_STORAGE) || "")}" placeholder="license key" style="margin-left:6px">
                <a id="dkTimerLicenseCheck" class="btn" style="cursor:pointer;margin-left:4px">Overit licenciu</a>
                <span id="dkTimerLicenseStatus" style="margin-left:6px;color:#6b4a28"></span>
            </div>`;

        host.insertBefore(panel, host.firstChild);

        document.getElementById("dkTimerLicenseCheck").onclick = async function () {
            const status = document.getElementById("dkTimerLicenseStatus");
            const key = document.getElementById("dkTimerLicenseInput").value.trim();

            status.textContent = "Overujem...";

            try {
                await checkLicense(key);
                status.textContent = "Licencia OK";
                status.style.color = "#2f7d32";
            } catch (error) {
                status.textContent = error.message;
                status.style.color = "#c51f1a";
            }
        };
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    window.DKTimerClient = {
        apiBase: API_BASE,
        checkLicense: checkLicense,
        requestJson: requestJson
    };

    renderLicensePanel();
})();
