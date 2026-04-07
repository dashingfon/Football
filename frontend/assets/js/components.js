

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
        )}
    }
);


// Add the option to toggle input


customElements.define('mode-toggle-button',
    class ModeToggleButton extends HTMLElement {

        setTheme(theme) {
            const body = document.body;
            if (theme === 'dark') {
                body.classList.add('dark');
                document.cookie = `theme=dark; path=/; max-age=31536000`
            } else {
                body.classList.remove('dark');
                document.cookie = `theme=light; path=/; max-age=31536000`
            }
        }

        connectedCallback() {
            const button = this.querySelector("[mode-toggle]");
            const toggle = this;

            button.addEventListener('click', function() {
                const stored = document.body.classList.contains("dark")
                if (stored) {
                    toggle.setTheme("light");
                    toggle.dataset.theme = 'light';
                } else {
                    toggle.setTheme("dark");
                    toggle.dataset.theme = 'dark';
                }
            });
        };
    }
);

