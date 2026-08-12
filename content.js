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

    // Les événements confirmés apparaissent dans l'agenda et peuvent être
    // mis en avant dans le journal grâce à leur visuel et leur lien.
    upcomingEvents: [
        {
            date: '29.08.2026',
            label: '1 an de Défi\'style · Lyon',
            title: 'One Year, New Era',
            description: 'Une soirée pour célébrer la première année de Défi\'style et ouvrir une nouvelle ère : accueil chic, dîner, espace photo, célébration et présentation de la suite de l\'aventure.',
            tags: [
                'Samedi · 20h00 — 23h00',
                'Beaucoco · 13 place Jules Ferry, Lyon 06',
                'Dress code : beige obligatoire',
                'Consommation minimum : 30 €',
                'Confirmation avant le 20 août'
            ],
            href: '#one-year-article',
            actionLabel: 'Lire l\'article sur One Year, New Era',
            image: 'photo/evenements/one-year-new-era.jpg',
            webp: 'photo/evenements/one-year-new-era.webp',
            imageAlt: 'Affiche de la soirée One Year, New Era pour les un an de Défi\'style'
        }
    ],

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
