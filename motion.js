(() => {
    'use strict';

    const { gsap, ScrollTrigger, SplitText, Lenis } = window;
    if (!gsap || !ScrollTrigger || !SplitText) return;
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const media = gsap.matchMedia();
    let navigating = false;

    const curtain = document.createElement('div');
    curtain.className = 'page-curtain';
    curtain.setAttribute('aria-hidden', 'true');
    const flower = document.createElement('img');
    flower.src = 'photo/identite/defistyle-anemone.webp';
    flower.alt = '';
    flower.width = 68;
    flower.height = 68;
    curtain.appendChild(flower);
    document.body.appendChild(curtain);

    const resetCurtain = () => {
        navigating = false;
        curtain.classList.remove('is-leaving');
        gsap.killTweensOf(curtain);
        gsap.set(curtain, { autoAlpha: 0, clearProps: 'clipPath' });
    };

    window.addEventListener('pageshow', (event) => {
        if (event.persisted) resetCurtain();
    });
    window.addEventListener('pagehide', resetCurtain);

    let arriving = false;
    try {
        arriving = sessionStorage.getItem('defistyle-page-arrival') === '1';
        sessionStorage.removeItem('defistyle-page-arrival');
    } catch {
        // Storage can be unavailable; normal navigation still works.
    }
    if (arriving && !reducedMotion.matches) {
        gsap.fromTo(curtain,
            { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)' },
            {
                clipPath: 'inset(0% 0% 100% 0%)',
                duration: 0.48, ease: 'power3.inOut',
                onComplete: resetCurtain
            }
        );
    }

    // Full navigations preserve normal links, anchors, forms and browser history.
    document.addEventListener('click', (event) => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey ||
            event.ctrlKey || event.shiftKey || event.altKey || reducedMotion.matches) return;
        const link = event.target.closest('a[href]');
        if (!link || link.hasAttribute('download') ||
            (link.target && link.target !== '_self')) return;

        const destination = new URL(link.href, location.href);
        if (destination.origin !== location.origin ||
            !/\.html$|\/$/.test(destination.pathname) ||
            destination.pathname === location.pathname) return;

        event.preventDefault();
        if (navigating) return;
        navigating = true;
        curtain.classList.add('is-leaving');
        const navigate = () => {
            try {
                sessionStorage.setItem('defistyle-page-arrival', '1');
            } catch {
                // The curtain does not require storage to leave the current page.
            }
            location.assign(destination.href);
        };
        // A fallback also completes navigation if the animation loop is suspended.
        const fallback = window.setTimeout(navigate, 900);
        gsap.fromTo(curtain,
            { autoAlpha: 1, clipPath: 'inset(100% 0% 0% 0%)' },
            {
                clipPath: 'inset(0% 0% 0% 0%)', duration: 0.38, ease: 'power3.inOut',
                onComplete: () => {
                    window.clearTimeout(fallback);
                    navigate();
                }
            }
        );
    });

    media.add('(prefers-reduced-motion: no-preference)', () => {
        const splitTitles = [];
        const seenPhotos = new WeakSet();

        // Splitting follows actual line breaks and recomputes after font/width changes.
        const animateTitle = (heading, entrance) => {
            heading.classList.add('motion-title');
            const split = SplitText.create(heading, {
                type: 'lines',
                mask: 'lines',
                autoSplit: true,
                onSplit(self) {
                    self.masks.forEach((mask) => mask.classList.add('motion-line-mask'));
                    return gsap.from(self.lines, {
                        yPercent: 105,
                        opacity: 0,
                        duration: entrance ? 0.95 : 0.75,
                        stagger: 0.09,
                        ease: 'power3.out',
                        delay: entrance ? 0.12 : 0,
                        scrollTrigger: entrance ? undefined : {
                            trigger: heading,
                            start: 'top 92%',
                            once: true
                        }
                    });
                }
            });
            splitTitles.push(split);
        };

        document.querySelectorAll('main h1, .legal-main h1').forEach((heading) => {
            animateTitle(heading, true);
        });
        document.querySelectorAll(
            '.front-section > .shell > h2, .front-section-head h2, ' +
            '.front-feature h2, .front-summary-grid h2, .page-section-title'
        ).forEach((heading) => animateTitle(heading, false));

        const revealPhoto = (frame, entrance = false) => {
            if (seenPhotos.has(frame) || frame.closest('[data-runway]')) return;
            seenPhotos.add(frame);
            frame.classList.add('motion-photo-frame');
            const archive = frame.parentElement.classList.contains('photo-gallery') ||
                frame.classList.contains('curated-item');
            const order = archive ? [...frame.parentElement.children].indexOf(frame) : 0;
            gsap.from(frame, {
                clipPath: 'inset(0% 0% 100% 0%)',
                y: archive ? 18 : 0,
                delay: archive ? (order % 3) * 0.06 : 0,
                duration: entrance ? 1.15 : 0.9,
                ease: 'power3.inOut',
                scrollTrigger: entrance ? undefined : {
                    trigger: frame,
                    start: 'top 93%',
                    once: true
                },
                clearProps: 'clipPath,transform'
            });
        };

        document.querySelectorAll(
            '.hero-media picture, .project-hero-photo, .context-hero-photo'
        ).forEach((frame) => revealPhoto(frame, true));
        document.querySelectorAll(
            '.front-identity, .front-poster, .front-photos, ' +
            '.page-photo-grid > *, .page-article > picture, .page-article > img, ' +
            '.photo-gallery > picture, .curated-item'
        ).forEach((frame) => revealPhoto(frame));

        // New archive batches receive the same short reveal when they enter view.
        const galleries = document.querySelectorAll('.photo-gallery');
        const galleryObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) revealPhoto(node);
                });
            });
            ScrollTrigger.refresh();
        });
        galleries.forEach((gallery) => galleryObserver.observe(gallery, { childList: true }));

        document.querySelectorAll('.front-directory-grid, .page-grid-3, .public-list')
            .forEach((row) => {
                gsap.from(row.children, {
                    y: 24, opacity: 0, duration: 0.6, stagger: 0.08,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: row, start: 'top 92%', once: true },
                    clearProps: 'transform,opacity'
                });
            });

        const refresh = () => ScrollTrigger.refresh();
        document.fonts?.ready.then(refresh);
        window.addEventListener('load', refresh, { once: true });

        return () => {
            galleryObserver.disconnect();
            splitTitles.forEach((split) => split.revert());
            document.querySelectorAll('.motion-title').forEach((heading) => {
                heading.classList.remove('motion-title');
            });
            window.removeEventListener('load', refresh);
        };
    });

    media.add({
        wide: '(min-width: 1024px) and (pointer: fine)',
        motion: '(prefers-reduced-motion: no-preference)'
    }, (context) => {
        if (!context.conditions.wide || !context.conditions.motion) return;

        let lenis;
        let syncScroll;
        let raf;
        let modalObserver;
        if (Lenis) {
            lenis = new Lenis({
                duration: 0.95,
                smoothWheel: true,
                anchors: { offset: -105 },
                prevent: (element) => Boolean(element.closest(
                    '.cookie-dialog, .article-modal, .lightbox, #site-nav, textarea, select'
                ))
            });
            syncScroll = () => ScrollTrigger.update();
            raf = (time) => lenis.raf(time * 1000);
            lenis.on('scroll', syncScroll);
            gsap.ticker.add(raf);
            const syncModal = () => {
                if (document.body.classList.contains('modal-open')) lenis.stop();
                else lenis.start();
            };
            modalObserver = new MutationObserver(syncModal);
            modalObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
            syncModal();
        }

        document.querySelectorAll('[data-runway]').forEach((runway) => {
            runway.classList.add('runway-is-active');
            const images = [...runway.querySelectorAll('.runway-image')];
            const steps = [...runway.querySelectorAll('.runway-step')];
            const caption = runway.querySelector('.runway-caption');
            let active = -1;

            const showStep = (index) => {
                if (active === index) return;
                active = index;
                steps.forEach((step, position) => {
                    step.classList.toggle('is-current', index === position);
                });
                images.forEach((image, position) => {
                    gsap.killTweensOf(image);
                    if (position === index) {
                        gsap.set(image, { zIndex: 2 });
                        gsap.fromTo(image,
                            { autoAlpha: 1, clipPath: 'inset(100% 0% 0% 0%)', scale: 1.045 },
                            { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 0.7, ease: 'power2.inOut' }
                        );
                    } else {
                        gsap.set(image, { zIndex: 1 });
                        gsap.to(image, { autoAlpha: 0, duration: 0.7, delay: 0.1 });
                    }
                });
                caption.textContent = steps[index].dataset.runwayCaption;
            };

            steps.forEach((step, index) => {
                ScrollTrigger.create({
                    trigger: step.querySelector('.runway-copy'),
                    start: 'top 68%',
                    end: 'bottom 22%',
                    onEnter: () => showStep(index),
                    onEnterBack: () => showStep(index),
                    onLeaveBack: () => showStep(Math.max(0, index - 1))
                });
            });
            showStep(0);
        });

        document.querySelectorAll('.fashion-interlude-frame').forEach((frame) => {
            gsap.fromTo(frame.querySelector('img'),
                { yPercent: -8 },
                {
                    yPercent: 0,
                    ease: 'none',
                    scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: 0.7 }
                }
            );
        });

        ScrollTrigger.refresh();
        return () => {
            modalObserver?.disconnect();
            if (lenis) {
                gsap.ticker.remove(raf);
                lenis.off('scroll', syncScroll);
                lenis.destroy();
            }
            document.querySelectorAll('[data-runway]').forEach((runway) => {
                runway.classList.remove('runway-is-active');
                runway.querySelectorAll('.runway-step').forEach((step) => {
                    step.classList.remove('is-current');
                });
            });
        };
    });

    // Below the desktop breakpoint, the photo accompanies its own concept.
    media.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        document.querySelectorAll('.runway-step-media').forEach((frame) => {
            gsap.from(frame, {
                opacity: 0, y: 22, duration: 0.65, ease: 'power2.out',
                scrollTrigger: { trigger: frame, start: 'top 93%', once: true },
                clearProps: 'opacity,transform'
            });
        });
    });
})();
