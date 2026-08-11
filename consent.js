(() => {
    'use strict';

    const STORAGE_KEY = 'defistyle-privacy-choice-v1';
    const banner = document.querySelector('#cookie-banner');
    const dialog = document.querySelector('#cookie-dialog');
    const optional = document.querySelector('[data-cookie-optional]');
    const closeButton = document.querySelector('[data-cookie-close]');
    let lastTrigger = null;

    if (!banner || !dialog) return;

    const readChoice = () => {
        try {
            return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null');
        } catch {
            return null;
        }
    };

    const saveChoice = (optionalChoice) => {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
                necessary: true,
                optional: Boolean(optionalChoice),
                savedAt: new Date().toISOString()
            }));
        } catch {
            // Le site reste utilisable même si le navigateur bloque le stockage local.
        }
        banner.hidden = true;
        closeDialog();
    };

    const openDialog = (trigger) => {
        lastTrigger = trigger || null;
        const choice = readChoice();
        if (optional) optional.checked = Boolean(choice?.optional);
        dialog.hidden = false;
        dialog.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        closeButton?.focus();
    };

    const closeDialog = () => {
        dialog.hidden = true;
        dialog.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        if (lastTrigger && !lastTrigger.closest('[hidden]')) lastTrigger.focus();
    };

    document.querySelectorAll('[data-cookie-accept]').forEach((button) => {
        button.addEventListener('click', () => saveChoice(true));
    });

    document.querySelectorAll('[data-cookie-reject]').forEach((button) => {
        button.addEventListener('click', () => saveChoice(false));
    });

    document.querySelectorAll('[data-cookie-save]').forEach((button) => {
        button.addEventListener('click', () => saveChoice(optional?.checked));
    });

    document.querySelectorAll('[data-cookie-settings]').forEach((button) => {
        button.addEventListener('click', () => openDialog(button));
    });

    closeButton?.addEventListener('click', closeDialog);
    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) closeDialog();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !dialog.hidden) closeDialog();
    });

    if (!readChoice()) {
        banner.hidden = false;
    }
})();
