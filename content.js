/*
 * CONTENU ÉDITABLE DÉFI'STYLE
 *
 * Les prochains événements et les photos des rendez-vous se gèrent ici,
 * sans modifier le HTML principal.
 */
window.DEFISTYLE_CONTENT = {
    site: {
        url: 'https://www.defistyle.fr',
        contactEmail: 'defistyle2025@gmail.com',
        instagramUrl: 'https://instagram.com/defi_style25',
        instagramHandle: '@defi_style25',
        siret: '993 830 017 00014'
    },

    // Ajouter un objet à cette liste dès qu'un événement est confirmé.
    // Exemple :
    // {
    //     date: '12.10.2026',
    //     label: 'Événement / Défilé',
    //     title: 'Nom de l’événement',
    //     description: 'Une courte présentation du rendez-vous.',
    //     tags: ['Paris', 'Entrée sur inscription'],
    //     href: '#rejoindre'
    // }
    upcomingEvents: [],

    // Lyon Fashion Day — 11 juillet 2026.
    // Les images sont réduites pour le web et chargées progressivement dans la galerie.
    lyonFashionDayPhotos: Array.from({ length: 144 }, (_, index) => {
        const photoNumber = String(index + 1).padStart(3, '0');
        return {
            src: `photo/lyon-fashion-day/lyon-fashion-day-${photoNumber}.jpg`,
            thumb: `photo/lyon-fashion-day/lyon-fashion-day-${photoNumber}.webp`,
            alt: `Lyon Fashion Day — photographie ${index + 1}`
        };
    }),

    // Sélection éditoriale affichée sur la page d'accueil.
    curatedLooks: [
        {
            src: 'photo/lyon-fashion-day/lyon-fashion-day-001.jpg',
            webp: 'photo/lyon-fashion-day/lyon-fashion-day-001.webp',
            alt: 'Mannequin sur le podium du Lyon Fashion Day',
            category: 'Lyon Fashion Day',
            title: 'Sur le podium'
        },
        {
            src: 'photo/lyon-fashion-day/lyon-fashion-day-011.jpg',
            webp: 'photo/lyon-fashion-day/lyon-fashion-day-011.webp',
            alt: 'Silhouette présentée au Lyon Fashion Day',
            category: 'Lyon Fashion Day',
            title: 'Une allure'
        },
        {
            src: 'photo/lyon-fashion-day/lyon-fashion-day-095.jpg',
            webp: 'photo/lyon-fashion-day/lyon-fashion-day-095.webp',
            alt: 'Portrait réalisé lors du Lyon Fashion Day',
            category: 'Lyon Fashion Day',
            title: 'Le détail compte'
        },
        {
            src: 'photo/lyon-fashion-day/lyon-fashion-day-121.jpg',
            webp: 'photo/lyon-fashion-day/lyon-fashion-day-121.webp',
            alt: 'Deux participantes au Lyon Fashion Day',
            category: 'Lyon Fashion Day',
            title: 'À deux voix'
        }
    ]
};
