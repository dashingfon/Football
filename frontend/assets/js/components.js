
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
            // add the rounds dropdown event listeners
            // 1. pause if playing
            // 2. set table to target round

            // add next and previous event listeners
            // 1. pause if playing
            // 2. set to target

            // add play and pause event listeners

        };

        set(round) {
            // use current round variable
        }

        play() {
            this.dataset.playing = "true"
            // set data-playing to true
        }

        pause() {
            this.dataset.playing = "false"
            // set data-playing to false
        }

        next() {
            this.dataset.playing = "false"
            // stop playing and set table to next
        }

        previous() {
            this.dataset.playing = "false"
            // stop playing and set table to previous
        }
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

        set_rounds() {
            const rounds = this.season_data.rounds
            let keys = Object.keys(rounds)
            if (keys.length > 1) {
                keys = keys.slice(1)
            }
            this.rounds = keys;
            document.querySelector("#round-dropdown-button .id").textContent = keys[0]
            const round_template = document.getElementById("round-template")
            const round_container = document.getElementById("rounds-list")
            round_container.innerHTML = ""
            for (const key of keys) {
                const clone = round_template.content.cloneNode(true);
                clone.querySelector(".round").textContent = key
                round_container?.appendChild(clone)
            }
        }

        set_table(round) {
            const rounds = this.season_data.rounds
            let max_val = 5
            let min_val = 0
            let data = rounds["0"]

            if (Object.keys(rounds).length == 1) {
                // set just it
                console.log("bypass")

            } else {
                data = rounds[round];
                for (const item of data.table) {
                    max_val = Math.max(parseInt(item[this.stats]), max_val)
                    min_val = Math.min(parseInt(item[this.stats]), min_val)
                }
            }

            const table_template = document.getElementById("table-entry-template")
            const table_container = document.getElementById("table-container")
            table_container.innerHTML = ""

            data.table.sort((a, b) => b[this.stats] - a[this.stats]);
            data.table.forEach((item, index) => {
                const clone = table_template.content.cloneNode(true);
                clone.querySelector(".index").textContent = `${index + 1}`
                clone.querySelector(".name").textContent = item.name
                clone.querySelector(".value").textContent = item[this.stats]
                clone.querySelector(".width").style.width = `${5 + ((parseInt(item[this.stats]) / max_val) * 85)}%`
                table_container?.appendChild(clone)
            })


        }

        async connectedCallback() {
            const self = this
            console.log(this)
            const params = new URLSearchParams(window.location.search);

            let season = params.get("season");
            if (season == null) {
                season = "february_2026"
            }
            this.season = season

            let stats = params.get("stats")
            if (stats == null) {
                stats = "goals"
            }
            this.stats = stats

            const season_el = document.getElementById("season-name")
            const season_text = season.replaceAll("_", " ")
            season_el.textContent = season_text[0].toUpperCase() + season_text.slice(1);

            const stats_el = document.getElementById("stats-name")
            const stats_text = stats.replaceAll("_", " ")
            if (stats == "g/a") {
                const val = "Goals + Assists"
                stats_el.textContent = val;
                document.getElementById("specific-stats").textContent = "Goals + Assists";
            } else {
                const val = stats_text[0].toUpperCase() + stats_text.slice(1);
                stats_el.textContent = val;
                document.getElementById("specific-stats").textContent = val;
            }

            const season_data = await fetch(`./seasons/${this.season}.json`)
            this.season_data = await season_data.json()

            const seasons = await fetch(`./seasons/seasons.json`)
            this.seasons = await seasons.json()

            const season_template = document.getElementById("seasons-template")
            const season_container = document.getElementById("seasons-list")
            season_container.innerHTML = ""

            // set the seasons
            for (const season of this.seasons) {
                const clone = season_template.content.cloneNode(true);
                clone.querySelector(".btn").setAttribute("data-season", season)
                const season_text = season.replaceAll("_", " ")
                clone.querySelector('.season').textContent = season_text[0].toUpperCase() + season_text.slice(1);;
                season_container?.appendChild(clone)
            }

            // send to new stats url with season and stats
            const season_dropdown = document.querySelectorAll("#season-dropdown button")
            season_dropdown.forEach((el) => {
                el.addEventListener("click", () => {
                    const init = document.querySelector("init-stats")
                    let url = new URL(window.location.href);
                    url.searchParams.set("season", el.dataset.season);
                    window.location.href = url.toString();
                })

            })

            // update the stats, and update the table
            const stats_dropdown = document.querySelectorAll("#stats-dropdown button")
            stats_dropdown.forEach((el) => {
                el.addEventListener("click", () => {
                    stats_el.textContent = el.textContent
                    document.getElementById("specific-stats").textContent = el.textContent
                    let url = new URL(window.location.href);
                    url.searchParams.set("stats", el.dataset.stats);
                    window.history.replaceState({}, "", url)

                    const chart = document.querySelector("chart-race");
                    if (chart.dataset.playing != "false") {
                        chart.pause()
                    }
                    const round = document.querySelector("#round-dropdown-button .id")
                    self.stats = el.dataset.stats
                    self.set_table(round.textContent)
                    document.getElementById("stats-dropdown")?.hidePopover()
                })
            })

            this.set_rounds()

            this.set_table("1")

            document.querySelector("nav-controller").dataset.loading = "false"
        };
    }
);

