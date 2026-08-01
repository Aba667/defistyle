/*
 * CONTENU ÉDITABLE DÉFI'STYLE
 *
 * Les prochains événements et les photos Lyon Fashion Day se gèrent ici,
 * sans modifier le HTML principal.
 */
window.DEFISTYLE_CONTENT = {
    site: {
        url: 'https://www.defistyle.fr',
        contactEmail: 'defistyle2025@gmail.com',
        instagramUrl: 'https://instagram.com/defi_style25',
        instagramHandle: '@defi_style25'
    },

    // Ajouter un objet à cette liste dès qu'un événement est confirmé.
    // Exemple :
    // {
    //     date: '12.10.2026',
    //     label: 'Événement / Défilé',
    //     title: 'Nom de l’événement',
    //     description: 'Une courte présentation du rendez-vous.',
    //     tags: ['Lyon', 'Entrée sur inscription'],
    //     href: '#participer'
    // }
    upcomingEvents: [],

    // Ajouter ici les photos Lyon Fashion Day une fois reçues.
    // Chaque photo peut avoir une vignette WebP facultative dans photo/thumbs/.
    // Exemple :
    // { src: 'photo/lyon-fashion-day/lyon-fashion-day-01.jpg', thumb: 'photo/thumbs/lyon-fashion-day-01.webp', alt: 'Lyon Fashion Day — look 01' }
    lyonFashionDayPhotos: [],

    // Sélection éditoriale affichée sur la page d'accueil.
    curatedLooks: [
        {
            src: 'photo/dti3.jpg',
            webp: 'photo/web/dti3-960.webp',
            alt: 'Silhouette Dress to Impress',
            category: 'Dress to Impress',
            title: 'Présence'
        },
        {
            src: 'photo/dti7.jpg',
            webp: 'photo/web/dti7-960.webp',
            alt: 'Détail d’une silhouette Défi\'style',
            category: 'Détail',
            title: 'Ligne libre'
        },
        {
            src: 'photo/image00014.jpeg',
            webp: 'photo/web/image00014-960.webp',
            alt: 'Portrait dans les archives lyonnaises',
            category: 'Lyon, 2026',
            title: 'Regards croisés'
        },
        {
            src: 'photo/retro21.jpg',
            webp: 'photo/web/retro21-960.webp',
            alt: 'Look de la soirée rétro Défi\'style',
            category: 'Archives',
            title: 'Après le flash'
        }
    ]
};
