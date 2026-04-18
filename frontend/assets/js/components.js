
customElements.define('mode-toggle-checkbox',
    class ModeToggleCheckbox extends HTMLElement {
        connectedCallback() {
            // console.log("opening");
            const checkbox = this.querySelector("input");
            // console.log("Checkbox found:", checkbox); // Debug
            const stored = localStorage.getItem('theme');
            // const body = document.body;

            if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                checkbox.checked = false;
                document.body.dataset.theme = 'dark';
                localStorage.setItem('theme', "dark");
            } else {
                checkbox.checked = true;
                document.body.dataset.theme = 'light';
                localStorage.setItem('theme', "light");
            }
            if (checkbox) {
                checkbox.addEventListener('change', function () {
                    // console.log("Change event fired, checked:", this.checked); // Debug
                    if (this.checked) {
                        document.body.dataset.theme = "light";
                        localStorage.setItem('theme', 'light');
                    } else {
                        document.body.dataset.theme = "dark";
                        localStorage.setItem('theme', 'dark')
                    }
                });
            }
        }
    })

customElements.define('mode-toggle-button',
    class ModeToggleButton extends HTMLElement {

        connectedCallback() {
            const mode_button = this.querySelector('button');
            // const body = document.body;
            const stored = localStorage.getItem('theme');

            function setTheme(theme) {
                if (theme === 'dark') {
                    document.body.dataset.theme = 'dark';
                } else {
                    document.body.dataset.theme = 'light';
                }
                localStorage.setItem('theme', theme);
            }

            if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                setTheme('dark');
            } else {
                setTheme('light');
            }
            if (mode_button) {
                mode_button.addEventListener("click", () => {
                    if (document.body.dataset.theme === "dark") {
                        document.body.dataset.theme = "light";
                        localStorage.setItem("theme", "light");
                    } else {
                        document.body.dataset.theme = "dark";
                        localStorage.setItem("theme", "dark");
                    }
                })
            }
        };
    }
);


customElements.define('nav-controller',
    class NavController extends HTMLElement {

        connectedCallback() {
            this.lastTogglePos = 0;
            const nav = document.getElementById(this.dataset.nav);
            const mainElement = this;
            const scrollThreshold = 20;

            function hide_nav() {
                const currentScrollPos = mainElement.scrollTop;
                const scrollDelta = Math.abs(currentScrollPos - this.lastTogglePos);

                if (scrollDelta >= scrollThreshold) {
                    if (currentScrollPos > this.lastTogglePos) {
                        // Scrolling down - hide nav
                        nav.setAttribute('data-hidden', 'true');
                    } else {
                        // Scrolling up - show nav
                        nav.setAttribute('data-hidden', 'false');
                    }
                    this.lastTogglePos = currentScrollPos;
                }
            }
            if (mainElement && nav) {
                mainElement.addEventListener('scroll', hide_nav);
            }
        };
    }
);

customElements.define('tab-sections',
    class TabSections extends HTMLElement {

        connectedCallback() {
            const container = document.getElementById("scroll-controller");
            const tabs = document.querySelectorAll(".tab");

            function setActiveTab(index) {
                tabs.forEach((tab, i) => {
                    if (i === index) {
                        tab.dataset.active = "true";
                    } else {
                        tab.dataset.active = "false";
                    }
                });
            }

            tabs.forEach((tab) => {
                tab.addEventListener("click", () => {
                    const index = Number(tab.dataset.index);
                    container.scrollTo({
                        left: index * container.clientWidth,
                        behavior: "smooth",
                    });
                });
            });

            const sections = container.children;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const index = [...sections].indexOf(entry.target);
                            setActiveTab(index);
                        }
                    });
                },
                {
                    root: container,
                    threshold: 0.6, // 60% visible = active
                }
            );

            [...sections].forEach((section) => observer.observe(section));
        };
    }
);

customElements.define('drop-down-toggle',
    class DropDownToggle extends HTMLElement {

        connectedCallback() {
            const button = this.querySelector("[dropdowntoggle]");
            const dropdown = this.querySelector("[dropdown]");
            button?.addEventListener("click", () => {
                dropdown?.classList.toggle("hidden")
            })
        };
    }
);

customElements.define('search-filter',
    class SearchFilter extends HTMLElement {

        connectedCallback() {
            const input = this.querySelector("input");
            input?.addEventListener("input", () => {
                const value = input.value.toLowerCase().trim();
                const leagues = document.querySelectorAll("#leagues a");

                if (value === "") {
                    leagues.forEach((el) => {
                        el.classList.remove("hidden");
                    });
                } else {
                    leagues.forEach((el) => {
                        const p = el.querySelector("p");
                        const text = p.textContent.toLowerCase();

                        if (text.includes(value)) {
                            el.classList.remove("hidden");
                        } else {
                            el.classList.add("hidden");
                        }
                    });
                }
            });
        };
    });


customElements.define('chart-race',
    class ChartRace extends HTMLElement {

        connectedCallback() {

        };
    }
);


customElements.define('stats-feed',
    class StatsFeed extends HTMLElement {

        connectedCallback() {

        };
    }
);

customElements.define('init-league',
    class InitLeague extends HTMLElement {

        connectedCallback() {

        };
    }
);

customElements.define('init-stats',
    class InitStats extends HTMLElement {

        connectedCallback() {
            const params = new URLSearchParams(window.location.search);
            let season = params.get("season");
            if (season == null) {
                season = "february_2026"
            }
            this.season = season
            const season_el = document.getElementById("season-name")
            const season_text = season.replace("_", " ")
            let result = season_text[0].toUpperCase() + season_text.slice(1);
            season_el.textContent = result

            let stats = params.get("stats")
            if (stats == null) {
                stats = "goals"
            }
            this.stats = stats
            this.season_data = fetch(`./seasons/${this.season}.json`)

            // send to new stats url with season and stats
            const season_dropdown = document.querySelectorAll("#season-dropdown button")
            season_dropdown.forEach((el) => {
                el.addEventListener("click", () => {
                    const init = document.querySelector("init-stats")
                    let url = new URL(window.location.href);
                    url.searchParams.set("season", el.dataset.season);
                    url.searchParams.set("stats", init.stats);
                    window.location.href = url.toString();
                })

            })

            // update the stats, and update the table
            const stats_dropdown = document.querySelectorAll("#season-dropdown button")

            // render the table and rounds

            // set loading to true
        };
    }
);

