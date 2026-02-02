/**
 * PROJET DÉFI'STYLE - SCRIPT COMPLET
 * Fonctionnalités : Double Galerie (Metz/Lyon), Load More, Lightbox, Sécurité
 */

document.addEventListener("DOMContentLoaded", function() {
    
    // --- VARIABLES GLOBALES LIGHTBOX ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-lightbox');

    // --- FONCTION GÉNÉRATRICE DE GALERIE ---
    // Cette fonction crée les images, gère le "Voir plus" et le clic Lightbox
    function createGallery(containerId, buttonId, prefix, start, end, extension, usePadding) {
        const container = document.getElementById(containerId);
        const button = document.getElementById(buttonId);

        if (!container) return;

        for (let i = start; i <= end; i++) {
            const img = document.createElement('img');
            
            // Gestion du nom de fichier
            let fileName;
            if (usePadding) {
                // Pour Lyon : Transforme 1 en "00001", 15 en "00015", etc.
                let paddedNumber = String(i).padStart(5, '0'); 
                fileName = `${prefix}${paddedNumber}.${extension}`;
            } else {
                // Pour Metz : def1, def2...
                fileName = `${prefix}${i}.${extension}`;
            }

            // Chemin des images (conforme à votre demande ../photo/)
            img.src = `../photo/${fileName}`; 
            img.alt = `Défi'style - Photo ${i}`;
            img.loading = "lazy";
            img.style.cursor = "zoom-in";
            img.setAttribute('draggable', 'false');

            // Si l'index est supérieur à 5 (donc la 6ème photo), on cache l'image
            if (i > 5) { 
                img.classList.add('hidden-photo');
            }

            // Ouverture Lightbox au clic
            img.addEventListener('click', () => {
                lightbox.style.display = "flex";
                lightboxImg.src = img.src;
                document.body.style.overflow = "hidden";
            });

            container.appendChild(img);
        }

        // Gestion du bouton "Afficher les autres photos"
        if (button) {
            button.addEventListener('click', function() {
                const hiddenImages = container.querySelectorAll('.hidden-photo');
                hiddenImages.forEach(image => {
                    image.classList.remove('hidden-photo'); 
                    image.style.animation = "fadeIn 0.5s ease-in";
                });
                button.style.display = 'none'; // Cache le bouton après clic
            });
        }
    }

    // --- 1. GÉNÉRATION DES DEUX GALERIES ---

    // GALERIE 1 : METZ (def1.jpg à def47.jpg)
    createGallery('gallery-metz', 'btn-metz', 'def', 1, 47, 'jpg', false);

    // GALERIE 2 : LYON (image00001.jpeg à image00175.jpeg)
    createGallery('gallery-lyon', 'btn-lyon', 'image', 1, 175, 'jpeg', true);


    // --- 2. GESTION FERMETURE LIGHTBOX ---
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
    // Bloquer clic droit
    document.addEventListener('contextmenu', e => e.preventDefault(), false);
    
    // Bloquer raccourcis clavier (F12, Inspecter...)
    document.onkeydown = function(e) {
        if (e.keyCode == 123) return false;
        if (e.ctrlKey && (e.shiftKey || e.keyCode == 'U'.charCodeAt(0))) {
            if (e.keyCode == 'I'.charCodeAt(0) || e.keyCode == 'J'.charCodeAt(0) || e.keyCode == 'U'.charCodeAt(0)) {
                return false;
            }
        }
    };

    // Bloquer double-clic
    document.addEventListener('mousedown', function (e) {
        if (e.detail > 1) e.preventDefault();
    }, false);

    console.log("Système Défi'style activé.");

});

// Animation douce en JS pour éviter de polluer le CSS
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
