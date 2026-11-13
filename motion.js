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
        gsap.fromTo(flower, { rotation: -18, scale: 0.8 }, {
            rotation: 0, scale: 1, duration: 0.48, ease: 'power2.out'
        });
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
        gsap.fromTo(flower, { rotation: 0, scale: 0.85 }, {
            rotation: 18, scale: 1, duration: 0.38, ease: 'power2.out'
        });
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

    media.add({
        motion: '(prefers-reduced-motion: no-preference)',
        compact: '(max-width: 1023px), (pointer: coarse)'
    }, (context) => {
        if (!context.conditions.motion) return;
        const compact = context.conditions.compact;
        const splitTitles = [];
        const seenPhotos = new WeakSet();
        const sectionStart = compact ? 'top 84%' : 'top 92%';

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
                        yPercent: compact ? 120 : 105,
                        rotation: compact ? 2 : 0,
                        transformOrigin: 'left bottom',
                        opacity: 0,
                        duration: compact ? 1.05 : (entrance ? 0.95 : 0.75),
                        stagger: compact ? 0.14 : 0.09,
                        ease: 'power3.out',
                        delay: entrance ? (arriving ? 0.4 : 0.16) : 0,
                        scrollTrigger: entrance ? undefined : {
                            trigger: heading,
                            start: sectionStart,
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
            '.front-feature h2, .front-summary-grid h2, .page-section-title, ' +
            '.page-story-copy h2, .page-event-copy h2, .page-contact-copy h2'
        ).forEach((heading) => animateTitle(heading, false));
        if (compact) {
            document.querySelectorAll('.runway-copy h2, .runway-copy h3')
                .forEach((heading) => animateTitle(heading, false));
        }

        const revealPhoto = (frame, entrance = false) => {
            if (seenPhotos.has(frame) || (!compact && frame.closest('[data-runway]'))) return;
            seenPhotos.add(frame);
            frame.classList.add('motion-photo-frame');
            const archive = frame.parentElement.classList.contains('photo-gallery') ||
                frame.classList.contains('curated-item');
            const order = archive ? [...frame.parentElement.children].indexOf(frame) : 0;
            // Mobile hero photos often begin below the fold. Reveal them on arrival.
            const inView = entrance && frame.getBoundingClientRect().top < innerHeight * (compact ? 0.65 : 0.84);
            const timeline = gsap.timeline({
                delay: archive ? (order % (compact ? 2 : 3)) * 0.08 : 0,
                scrollTrigger: inView ? undefined : {
                    trigger: frame,
                    start: compact ? 'top 74%' : 'top 93%',
                    once: true
                }
            });
            timeline.from(frame, {
                clipPath: compact ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 100% 0%)',
                y: compact ? 34 : (archive ? 18 : 0),
                duration: compact ? 1.05 : (entrance ? 1.15 : 0.9),
                ease: compact ? 'power2.out' : 'power3.inOut',
                clearProps: 'clipPath,transform'
            });
            const images = frame.querySelectorAll('img');
            if (images.length && !frame.matches('.front-identity')) {
                timeline.from(images, {
                    scale: compact ? 1.14 : 1.055,
                    duration: compact ? 1.25 : 1.15,
                    ease: 'power2.out',
                    clearProps: 'transform'
                }, 0);
            }
        };

        document.querySelectorAll(
            '.hero-media picture, .project-hero-photo, .context-hero-photo'
        ).forEach((frame) => revealPhoto(frame, true));
        document.querySelectorAll(
            '.front-identity, .front-poster, .front-photos, ' +
            '.page-photo-grid > *, .page-article > picture, .page-article > img, ' +
            '.photo-gallery > picture, .curated-item'
        ).forEach((frame) => revealPhoto(frame));
        if (compact) {
            document.querySelectorAll('.runway-step-media').forEach((frame) => revealPhoto(frame));
            document.querySelectorAll('.runway-copy').forEach((copy) => {
                gsap.from(copy.querySelectorAll('p, a'), {
                    y: 26, opacity: 0, duration: 0.75, stagger: 0.12,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: copy, start: sectionStart, once: true },
                    clearProps: 'transform,opacity'
                });
            });
            document.querySelectorAll('.fashion-interlude-frame').forEach((frame) => {
                gsap.fromTo(frame.querySelector('img'), { yPercent: -9 }, {
                    yPercent: 0, ease: 'none',
                    scrollTrigger: {
                        trigger: frame, start: 'top bottom', end: 'bottom top', scrub: 0.4
                    }
                });
            });
        }

        // New archive batches receive the same short reveal when they enter view.
        const galleries = document.querySelectorAll('.photo-gallery');
        const galleryObserver = new MutationObserver((mutations) => {
            context.add(() => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) revealPhoto(node);
                    });
                });
                ScrollTrigger.refresh();
            });
        });
        galleries.forEach((gallery) => galleryObserver.observe(gallery, { childList: true }));

        document.querySelectorAll('.front-directory-grid, .page-grid-3, .public-list')
            .forEach((row) => {
                const groups = compact ? [...row.children] : [row];
                groups.forEach((trigger) => {
                    gsap.from(compact ? trigger : row.children, {
                        y: compact ? 48 : 24, opacity: 0,
                        duration: compact ? 0.85 : 0.6,
                        stagger: compact ? 0 : 0.08,
                        ease: 'power2.out',
                        scrollTrigger: { trigger, start: sectionStart, once: true },
                        clearProps: 'transform,opacity'
                    });
                });
            });

        const siteHeader = document.querySelector('.site-header');
        const progress = document.createElement('div');
        progress.className = 'reading-progress';
        progress.setAttribute('aria-hidden', 'true');
        if (siteHeader) {
            siteHeader.appendChild(progress);
            gsap.fromTo(progress, { scaleX: 0 }, {
                scaleX: 1, ease: 'none',
                scrollTrigger: { start: 0, end: 'max', scrub: 0.2 }
            });
        }

        const navigation = document.querySelector('#site-nav');
        const menuObserver = new MutationObserver(() => {
            if (!navigation) return;
            gsap.killTweensOf(navigation.children);
            if (navigation.classList.contains('is-open')) {
                gsap.fromTo(navigation.children, { x: -22, opacity: 0 }, {
                    x: 0, opacity: 1, duration: 0.42, stagger: 0.035,
                    ease: 'power2.out', clearProps: 'transform,opacity'
                });
            } else {
                gsap.set(navigation.children, { clearProps: 'transform,opacity' });
            }
        });
        if (navigation) menuObserver.observe(navigation, { attributes: true, attributeFilter: ['class'] });

        const refresh = () => ScrollTrigger.refresh();
        document.fonts?.ready.then(refresh);
        window.addEventListener('load', refresh, { once: true });

        return () => {
            galleryObserver.disconnect();
            menuObserver.disconnect();
            if (navigation) {
                gsap.killTweensOf(navigation.children);
                gsap.set(navigation.children, { clearProps: 'transform,opacity' });
            }
            progress.remove();
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

})();
