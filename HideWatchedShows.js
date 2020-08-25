// ==UserScript==
// @name         KitsuEnhanced
// @namespace    https://github.com/Fuzen-py/KitsuEnhanced
// @version      0.1
// @description  Hide Anime you finished watching
// @author       Fuzen-py
// @match        https://kitsu.io/anime?*
// @home-url     https://github.com/Fuzen-py/KitsuEnhanced
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    {
        let MO = window.MutationObserver || window.WebKitMutationObserver;
        let mutation_handler = null;
        function filter_completed_shows() {
            let active = document.querySelector('#filter-completed-shows-state').checked;
            Array.prototype.slice.call(document.querySelectorAll('div.media-posters-list > div'))
                .forEach(e => {
                    if (e.querySelector('button').textContent.trim().toLowerCase() === "completed") {
                        e.style.display = active ? "none" : "block";
                    }
                })
        }

        function observe_changes() {
            filter_completed_shows();
            let mutationObserver = new MO(mutations => {
                filter_completed_shows();
            });
            mutationObserver.observe(document.querySelector("div.media-posters"), {
                attributes: true,
                characterData: true,
                childList: true,
                subtree: true,
                attributeOldValue: true,
                characterDataOldValue: true
            });
            return mutationObserver;
        }
        window.addEventListener('load', function () {
            let ready = false;
            let mt = new MO(m => {
                ready = document.querySelector("div.filter-options > div.filter-wrapper") !== null;
                if (ready) load_plugin();
            })
            var load_plugin = () => {
                console.log("Loading plugin...")
                mt.disconnect()

                // Insert the HTML Needed for functionality
                let completed_section = `
            <div id="filter-completed" class="filter-widget">
                <div class="filter-header">
                    <label class="filter-title">Hide Completed</label>
                    <span class="filter-values">
                        <input type="checkbox" id="filter-completed-shows-state">
                    </span>
                </div>
            </div>
            `;
                let filter_panel = document.querySelector("div.filter-options > div.filter-wrapper");
                filter_panel.insertAdjacentHTML('afterBegin', completed_section);
                document.querySelector('#filter-completed-shows-state').addEventListener('click', () => {
                    if (document.querySelector('#filter-completed-shows-state').checked) {
                        if (mutation_handler === null) {
                            mutation_handler = observe_changes()
                        } else {
                            filter_completed_shows();
                        }
                    } else {
                        if (mutation_handler !== null) {
                            mutation_handler.disconnect();
                            mutation_handler = null;
                        }
                        filter_completed_shows()
                    }
                })
            }
            mt.observe(document.body, {
                attributes: true,
                characterData: true,
                childList: true,
                subtree: true,
                attributeOldValue: true,
                characterDataOldValue: true
            });
        })
    }
})();
