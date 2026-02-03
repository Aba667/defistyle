/**
 * PROJET DÉFI'STYLE - SCRIPT FINAL CORRIGÉ
 * Chemin photos : "photo/" (au même niveau que l'index)
 */

document.addEventListener("DOMContentLoaded", function() {
    
    // --- VARIABLES GLOBALES LIGHTBOX ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-lightbox');

    // --- FONCTION GÉNÉRATRICE DE GALERIE ---
    function createGallery(containerId, buttonId, prefix, start, end, extension, usePadding) {
        const container = document.getElementById(containerId);
        const button = document.getElementById(buttonId);

        if (!container) return;

        for (let i = start; i <= end; i++) {
            const img = document.createElement('img');
            
            // Gestion du nom de fichier
            let fileName;
            if (usePadding) {
                // Pour Lyon : 1 devient "00001"
                let paddedNumber = String(i).padStart(5, '0'); 
                fileName = `${prefix}${paddedNumber}.${extension}`;
            } else {
                // Pour Metz : 1 reste "1"
                fileName = `${prefix}${i}.${extension}`;
            }

            // --- CORRECTION ICI : "photo/" au lieu de "../photo/" ---
            img.src = `photo/${fileName}`; 
            
            img.alt = `Défi'style - Photo ${i}`;
            img.loading = "lazy";
            img.style.cursor = "zoom-in";
            img.setAttribute('draggable', 'false');

            // On cache les photos après la 5ème
            if (i > 5) { 
                img.classList.add('hidden-photo');
            }

            // Lightbox (Zoom)
            img.addEventListener('click', () => {
                lightbox.style.display = "flex";
                lightboxImg.src = img.src;
                document.body.style.overflow = "hidden";
            });

            container.appendChild(img);
        }

        // Bouton "Afficher les autres photos"
        if (button) {
            button.addEventListener('click', function() {
                const hiddenImages = container.querySelectorAll('.hidden-photo');
                hiddenImages.forEach(image => {
                    image.classList.remove('hidden-photo'); 
                    image.style.animation = "fadeIn 0.5s ease-in";
                });
                button.style.display = 'none';
            });
        }
    }

    // --- 1. GÉNÉRATION DES GALERIES ---

    // GALERIE 1 : LYON (Mise en avant) - image00001.jpeg à image00175.jpeg
    createGallery('gallery-lyon', 'btn-lyon', 'image', 1, 175, 'jpeg', true);

    // GALERIE 2 : METZ - def1.jpg à def47.jpg
    createGallery('gallery-metz', 'btn-metz', 'def', 1, 47, 'jpg', false);


    // --- 2. FERMETURE LIGHTBOX ---
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            lightbox.style.display = "none";
            document.body.style.overflow = "auto";
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target !== lightboxImg) {
                lightbox.style.display = "none";
                document.body.style.overflow = "auto";
            }
        });
    }

    // --- 3. SÉCURITÉ ---
    document.addEventListener('contextmenu', e => e.preventDefault(), false);
    
    document.onkeydown = function(e) {
        if (e.keyCode == 123) return false;
        if (e.ctrlKey && (e.shiftKey || e.keyCode == 'U'.charCodeAt(0))) {
            if (e.keyCode == 'I'.charCodeAt(0) || e.keyCode == 'J'.charCodeAt(0) || e.keyCode == 'U'.charCodeAt(0)) {
                return false;
            }
        }
    };

    document.addEventListener('mousedown', function (e) {
        if (e.detail > 1) e.preventDefault();
    }, false);

});

// Animation CSS injectée
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
