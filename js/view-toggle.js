// Designer / Programmer view toggle
// Pretty much just sets the data-view on the root <html> element. CSS handles the rest
// elements that toggle need to be tagged with .content-designer or .content-programmer

(function () {
    const STORAGE_KEY = 'siteView';
    const root = document.documentElement;
    const buttons = document.querySelectorAll('.view-toggle-button');

    if (buttons.length === 0) return; // Not a page with any need for loading toggles. This also means toggles with tags wont work

    function setView(view) {
        root.setAttribute('data-view', view);

        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        try {
            sessionStorage.setItem(STORAGE_KEY, view);
        } catch (error) {
            console.log('Could not set view preference:', error);
        }
    }

    let initialView = 'designer';
    try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored === 'designer' || stored === 'programmer') {
            initialView = stored;
        }
    } catch (error) {
        console.log('Could not get view preference:', error);
    }

    setView(initialView);

    buttons.forEach(btn => {
        btn.addEventListener('click', () => setView(btn.dataset.view));
    });
})();