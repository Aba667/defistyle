(() => {
    'use strict';

    const content = window.DEFISTYLE_CONTENT || {};
    const site = {
        contactEmail: 'defistyle2025@gmail.com',
        instagramUrl: 'https://instagram.com/defi_style25',
        instagramHandle: '@defi_style25',
        ...(content.site || {})
    };
    const body = document.body;

    const escapeHTML = (value = '') => String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');

    const addArrow = (element, label) => {
        element.replaceChildren(document.createTextNode(`${label} `));
        const arrow = document.createElement('span');
        arrow.setAttribute('aria-hidden', 'true');
        arrow.textContent = '↗';
        element.appendChild(arrow);
    };

    // Liens configurables dans content.js
    document.querySelectorAll('[data-contact-email]').forEach((link) => {
        link.href = `mailto:${site.contactEmail}`;
        link.firstChild.textContent = `${site.contactEmail} `;
    });

    document.querySelectorAll('[data-instagram-link]').forEach((link) => {
        link.href = site.instagramUrl;
    });

    document.querySelectorAll('[data-instagram-handle]').forEach((element) => {
        element.textContent = site.instagramHandle;
    });

    // Navigation mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const siteNav = document.querySelector('#site-nav');

    if (menuToggle && siteNav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', String(!isOpen));
            siteNav.classList.toggle('is-open', !isOpen);
        });

        siteNav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', 'false');
                siteNav.classList.remove('is-open');
            });
        });
    }

    // Lightbox photo : une seule instance réutilisée pour limiter le DOM.
    const lightbox = document.querySelector('#lightbox');
    const lightboxImg = document.querySelector('#lightbox-img');
    const lightboxClose = document.querySelector('.close-lightbox');

    const openLightbox = (src, alt) => {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        lightboxImg.alt = alt || 'Photo Défi\'style agrandie';
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        body.classList.add('modal-open');
        lightboxClose?.focus();
    };

    const closeLightbox = () => {
        if (!lightbox) return;
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        body.classList.remove('modal-open');
        if (lightboxImg) lightboxImg.removeAttribute('src');
    };

    lightboxClose?.addEventListener('click', closeLightbox);
    lightbox?.addEventListener('click', (event) => {
        if (event.target === lightbox) closeLightbox();
    });

    const createResponsiveImage = ({ src, webp, alt, width = 900, height = 1125, loading = 'lazy' }) => {
        const picture = document.createElement('picture');
        if (webp) {
            const source = document.createElement('source');
            source.type = 'image/webp';
            source.srcset = webp;
            picture.appendChild(source);
        }

        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.width = width;
        img.height = height;
        img.loading = loading;
        img.decoding = 'async';
        img.draggable = false;
        picture.appendChild(img);

        return { picture, img };
    };

    const renderCuratedLooks = () => {
        const container = document.querySelector('[data-curated-looks]');
        const looks = Array.isArray(content.curatedLooks) ? content.curatedLooks.slice(0, 4) : [];
        if (!container || looks.length === 0) return;

        const fragment = document.createDocumentFragment();
        looks.forEach((look, index) => {
            const figure = document.createElement('figure');
            figure.className = 'curated-item';
            const image = createResponsiveImage({
                src: look.src,
                webp: look.webp,
                alt: look.alt || `Sélection Défi'style ${index + 1}`,
                width: 960,
                height: 1200
            });

            image.img.addEventListener('click', () => openLightbox(look.src, image.img.alt));
            figure.appendChild(image.picture);

            const caption = document.createElement('figcaption');
            caption.innerHTML = `<span>${String(index + 1).padStart(2, '0')}</span><p><small>${escapeHTML(look.category || 'Sélection')}</small>${escapeHTML(look.title || 'Défi\'style')}</p>`;
            figure.appendChild(caption);
            fragment.appendChild(figure);
        });

        container.replaceChildren(fragment);
    };

    const createGalleryAssets = ({ prefix, start, end, extension, padded, label }) => (
        Array.from({ length: end - start + 1 }, (_, index) => {
            const number = start + index;
            const value = padded ? String(number).padStart(5, '0') : String(number);
            return {
                src: `photo/${prefix}${value}.${extension}`,
                webp: `photo/thumbs/${prefix}${value}.webp`,
                alt: `${label} — photographie ${index + 1}`
            };
        })
    );

    // Galeries progressives : seules les premières images sont montées au chargement.
    const createGallery = ({ containerId, buttonId, assets, initialBatch = 5, nextBatch = 12 }) => {
        const container = document.querySelector(`#${containerId}`);
        const button = document.querySelector(`#${buttonId}`);
        if (!container || !Array.isArray(assets) || assets.length === 0) return;

        let rendered = 0;

        const updateButton = () => {
            if (!button) return;
            const remaining = assets.length - rendered;
            if (remaining <= 0) {
                button.hidden = true;
                return;
            }
            addArrow(button, rendered === initialBatch
                ? 'Voir les images suivantes'
                : `Voir encore ${Math.min(remaining, nextBatch)} images`);
        };

        const renderNext = (amount) => {
            const endIndex = Math.min(rendered + amount, assets.length);
            const fragment = document.createDocumentFragment();

            for (let index = rendered; index < endIndex; index += 1) {
                const asset = assets[index];
                const image = createResponsiveImage({
                    src: asset.src,
                    webp: asset.webp,
                    alt: asset.alt || `Photo Défi'style ${index + 1}`,
                    loading: index === 0 ? 'eager' : 'lazy'
                });
                image.img.addEventListener('click', () => openLightbox(asset.src, image.img.alt));
                fragment.appendChild(image.picture);
            }

            container.appendChild(fragment);
            rendered = endIndex;
            updateButton();
        };

        renderNext(initialBatch);
        button?.addEventListener('click', () => renderNext(nextBatch));
    };

    [
        {
            containerId: 'gallery-prada',
            buttonId: 'btn-prada',
            assets: createGalleryAssets({ prefix: 'dti', start: 1, end: 107, extension: 'jpg', padded: false, label: 'Dress to Impress — Le Diable s\'habille en Prada' })
        },
        {
            containerId: 'gallery-retro',
            buttonId: 'btn-retro',
            assets: createGalleryAssets({ prefix: 'retro', start: 1, end: 34, extension: 'jpg', padded: false, label: 'Soirée rétro années 70–80' })
        },
        {
            containerId: 'gallery-lyon',
            buttonId: 'btn-lyon',
            assets: createGalleryAssets({ prefix: 'image', start: 1, end: 175, extension: 'jpeg', padded: true, label: 'Dress to Impress — silhouettes lyonnaises' })
        },
        {
            containerId: 'gallery-metz',
            buttonId: 'btn-metz',
            assets: createGalleryAssets({ prefix: 'def', start: 1, end: 47, extension: 'jpg', padded: false, label: 'Lancement officiel Défi\'style' })
        }
    ].forEach(createGallery);

    const renderLyonFashionDayPhotos = () => {
        const photos = Array.isArray(content.lyonFashionDayPhotos) ? content.lyonFashionDayPhotos : [];
        const update = document.querySelector('#lyon-fashion-day-update');
        if (!update || photos.length === 0) return;

        update.hidden = false;
        createGallery({
            containerId: 'gallery-lyon-fashion-day',
            buttonId: 'btn-lyon-fashion-day',
            assets: photos.map((photo, index) => ({
                src: photo.src,
                webp: photo.thumb || '',
                alt: photo.alt || `Lyon Fashion Day — photographie ${index + 1}`
            })),
            initialBatch: 6,
            nextBatch: 12
        });
    };

    const renderUpcomingEvents = () => {
        const container = document.querySelector('[data-upcoming-events]');
        const events = Array.isArray(content.upcomingEvents) ? content.upcomingEvents : [];
        if (!container) return;

        if (events.length === 0) {
            container.innerHTML = `
                <article class="coming-soon-card">
                    <span class="coming-soon-mark" aria-hidden="true">✳</span>
                    <div>
                        <p class="event-type">Prochains rendez-vous</p>
                        <h3>À venir</h3>
                        <p>Les dates, les lieux et les formats seront publiés ici dès qu'ils seront confirmés.</p>
                    </div>
                </article>`;
            return;
        }

        container.innerHTML = events.map((event, index) => {
            const tags = Array.isArray(event.tags) ? event.tags : [];
            const href = event.href || '#rejoindre';
            return `
                <article class="event-card">
                    <div class="event-number">${String(index + 1).padStart(2, '0')}</div>
                    <div class="event-date"><strong>${escapeHTML(event.date || 'À venir')}</strong><span>${escapeHTML(event.label || 'Événement Défi\'style')}</span></div>
                    <div class="event-detail">
                        <p class="event-type">${escapeHTML(event.label || 'Événement')}</p>
                        <h3>${escapeHTML(event.title || 'À venir')}</h3>
                        <p>${escapeHTML(event.description || '')}</p>
                        ${tags.length ? `<ul class="event-tags">${tags.map((tag) => `<li>${escapeHTML(tag)}</li>`).join('')}</ul>` : ''}
                    </div>
                    <a class="event-arrow" href="${escapeHTML(href)}" aria-label="En savoir plus sur ${escapeHTML(event.title || 'cet événement')}">↗</a>
                </article>`;
        }).join('');
    };

    const getFormStatus = (form) => form.querySelector('.form-status');
    const setFormStatus = (form, message, state = '') => {
        const status = getFormStatus(form);
        if (!status) return;
        status.textContent = message;
        status.dataset.state = state;
    };

    const buildMailto = (subject, lines) => (
        `mailto:${site.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`
    );

    document.querySelectorAll('[data-mail-form]').forEach((form) => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            if (!form.checkValidity()) {
                setFormStatus(form, 'Merci de renseigner les champs demandés.', 'error');
                form.reportValidity();
                return;
            }

            const type = form.dataset.mailForm;
            const email = form.elements.email?.value.trim() || '';
            let subject;
            let lines;

            if (type === 'newsletter') {
                subject = 'Inscription aux prochaines actualités Défi\'style';
                lines = [
                    'Bonjour Défi\'style,',
                    '',
                    'Je souhaite recevoir les informations sur vos prochains rendez-vous.',
                    `Mon adresse email : ${email}`
                ];
            } else {
                subject = `Nouvelle demande — ${form.elements.interest.value}`;
                lines = [
                    'Bonjour Défi\'style,',
                    '',
                    `Je suis : ${form.elements.interest.value}`,
                    `Nom ou structure : ${form.elements.name.value.trim()}`,
                    `Adresse email : ${email}`,
                    '',
                    'Mon message :',
                    form.elements.message.value.trim()
                ];
            }

            setFormStatus(form, 'Votre messagerie va s’ouvrir avec votre message prérempli.', 'success');
            window.location.href = buildMailto(subject, lines);
        });
    });

    document.querySelectorAll('[data-participation-type]').forEach((card) => {
        card.addEventListener('click', () => {
            const select = document.querySelector('#contact-interest');
            if (select) select.value = card.dataset.participationType;
        });
    });

    // Lecture des articles : le contenu reste dans des templates HTML et n'est injecté qu'à la demande.
    const articleModal = document.querySelector('#article-modal');
    const articleContent = document.querySelector('#article-modal-content');
    const articleClose = document.querySelector('[data-close-article]');
    let lastArticleTrigger = null;

    const closeArticle = () => {
        if (!articleModal) return;
        articleModal.classList.remove('is-open');
        articleModal.setAttribute('aria-hidden', 'true');
        body.classList.remove('modal-open');
        if (lastArticleTrigger) lastArticleTrigger.focus();
    };

    document.querySelectorAll('[data-article]').forEach((trigger) => {
        trigger.addEventListener('click', () => {
            const template = document.querySelector(`#${trigger.dataset.article}`);
            if (!template || !articleModal || !articleContent) return;

            lastArticleTrigger = trigger;
            articleContent.replaceChildren(template.content.cloneNode(true));
            articleModal.classList.add('is-open');
            articleModal.setAttribute('aria-hidden', 'false');
            body.classList.add('modal-open');
            articleClose?.focus();
        });
    });

    articleClose?.addEventListener('click', closeArticle);
    articleModal?.addEventListener('click', (event) => {
        if (event.target === articleModal) closeArticle();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        if (articleModal?.classList.contains('is-open')) closeArticle();
        if (lightbox?.classList.contains('is-open')) closeLightbox();
    });

    renderCuratedLooks();
    renderUpcomingEvents();
    renderLyonFashionDayPhotos();
})();
