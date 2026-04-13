

customElements.define('desktop-sidebar',
    class DesktopSidebar extends HTMLElement {

        expand(toggleIcon, sidebarContent) {
            toggleIcon.style.transform = 'rotate(0deg)';
            sidebarContent.setAttribute('data-expanded', 'true');
            document.cookie = `sidebar=expanded; path=/; max-age=31536000`
        }

        collapse(toggleIcon, sidebarContent) {
            // this.sidebarContent.setAttribute("data-expanded", "false")
            // Array.from(spans).forEach(span => span.classList.add('hidden'));
            toggleIcon.style.transform = 'rotate(180deg)';
            sidebarContent.setAttribute('data-expanded', 'false');
            document.cookie = `sidebar=collapsed; path=/; max-age=31536000`
        }

        connectedCallback() {
            // set the default sidebar width

            this.sidebar = this.querySelector('[separator-sidebar]');
            this.toggleIcon = this.querySelector('[toggle-icon]');
            this.sidebarContent = this.sidebar.querySelector('div');

            const isExpanded = this.sidebarContent.dataset.expanded === "true";
            if (isExpanded) {
                this.toggleIcon.style.transform = 'rotate(0deg)';
            } else {
                this.toggleIcon.style.transform = 'rotate(180deg)';
            }

            // add event listiner
            const button = this.querySelector("[sidebar-button]");
            button.addEventListener(
                "click", () => {
                    const isExpanded = this.sidebarContent.dataset.expanded === "true";
                    if (isExpanded) {
                        this.collapse(this.toggleIcon, this.sidebarContent);
                    } else {
                        this.expand(this.toggleIcon, this.sidebarContent);
                    }
                }
            )
        }
    }
);

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


// customElements.define('drop-down',
//     class DropDown extends HTMLElement {

//         connectedCallback() {
//             const target_id = this.dataset.target
//             const dropdown = document.getElementById(target_id);
//             const top = this.dataset.position;
//             const button = this.querySelector("button")
//             const rect = this.getBoundingClientRect();

//             if (rect) {
//                 dropdown.style.position = "absolute";
//                 if (top === "top") {
//                     dropdown.style.top = `${rect.top}px`;
//                 } else {
//                     dropdown.style.top = `${rect.bottom}px`;
//                 }
//                 dropdown.style.right = `${16}px`;
//                 // dropdown.style.left = `${rect.right}px`;
//                 // dropdown.style.right = `${rect.left - 20}px`;
//             }

//             button?.addEventListener("click", () => {
//                 if (button.dataset.dropdown === "dropdown") {
//                     dropdown?.classList.toggle("hidden")
//                     button.dataset.dropdown = ""
//                     // remove event listener
//                 } else {
//                     dropdown?.classList.toggle("hidden")
//                     button.dataset.dropdown = "dataset"
//                     // add event listener
//                 }
//             })
//         };
//     }
// );


customElements.define('tab-sections',
    class TabSections extends HTMLElement {

        connectedCallback() {

        };
    }
);


customElements.define('chart-race',
    class ChartRace extends HTMLElement {

        connectedCallback() {

        };
    }
);


customElements.define('stats-feed',
    class ChartRace extends HTMLElement {

        connectedCallback() {

        };
    }
);

