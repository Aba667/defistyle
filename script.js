/**
 * PROJET DÉFI'STYLE - SCRIPT COMPLET
 * Fonctionnalités : Galerie dynamique, Lightbox (Zoom) et Sécurité renforcée
 */

document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. CONFIGURATION DE LA GALERIE ET DE LA LIGHTBOX ---
    const galleryGrid = document.getElementById('gallery-grid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-lightbox');

    if (galleryGrid) {
        // Boucle pour générer les 50 photos (def1 à def50)
        for (let i = 1; i <= 47; i++) {
            const img = document.createElement('img');
            img.src = `photo/def${i}.jpg`; 
            img.alt = `Défilé Défi'style - Création ${i}`;
            img.loading = "lazy"; // Optimisation des performances
            img.style.cursor = "zoom-in";
            
            // Sécurité : Empêche le glisser-déposer de l'image
            img.setAttribute('draggable', 'false');

            // Événement pour ouvrir la photo en grand (Lightbox)
            img.addEventListener('click', () => {
                lightbox.style.display = "flex";
                lightboxImg.src = img.src;
                document.body.style.overflow = "hidden"; // Bloque le scroll derrière
            });

            galleryGrid.appendChild(img);
        }
    }

    // --- 2. FERMETURE DE LA LIGHTBOX ---
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            lightbox.style.display = "none";
            document.body.style.overflow = "auto";
        });
    }

    // Fermer si on clique sur le fond noir de la lightbox
    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg) {
            lightbox.style.display = "none";
            document.body.style.overflow = "auto";
        }
    });

    // --- 3. SÉCURITÉ : PROTECTION DES CRÉATIONS ---
    
    // Blocage du clic droit (Menu contextuel)
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    }, false);

    // Blocage des touches d'inspection et raccourcis de copie
    document.onkeydown = function(e) {
        // F12 (Inspecteur)
        if (e.keyCode == 123) return false;
        
        // Ctrl+Shift+I (Inspecter), Ctrl+Shift+J (Console), Ctrl+U (Code source)
        if (e.ctrlKey && (e.shiftKey || e.keyCode == 'U'.charCodeAt(0))) {
            if (e.keyCode == 'I'.charCodeAt(0) || e.keyCode == 'J'.charCodeAt(0) || e.keyCode == 'U'.charCodeAt(0)) {
                return false;
            }
        }
        
        // Ctrl+S (Enregistrer sous)
        if (e.ctrlKey && e.keyCode == 'S'.charCodeAt(0)) return false;
    };

    // Protection contre la sélection de texte par double-clic
    document.addEventListener('mousedown', function (e) {
        if (e.detail > 1) {
            e.preventDefault();
        }
    }, false);

    console.log("Système Défi'style activé : Galerie, Zoom et Sécurité opérationnels.");
});
