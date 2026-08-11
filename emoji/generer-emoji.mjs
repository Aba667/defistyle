/*
 * GÉNÉRATEUR DES EMOJI DÉFI'STYLE
 *
 * Source unique : emoji/defistyle-emoji.svg
 *
 * Lancer :  node emoji/generer-emoji.mjs
 *
 * Le script :
 *   1. relit chaque <symbol> du fichier source ;
 *   2. écrit un fichier emoji/<nom>.svg autonome (couleurs figées),
 *      utilisable partout : réseaux sociaux, affiches, présentations ;
 *   3. recopie le jeu complet dans index.html et site.html,
 *      entre les balises <!-- ds:emoji:start --> et <!-- ds:emoji:end --> ;
 *   4. écrit emoji/apercu.html, la planche de tous les emoji.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dossierEmoji = dirname(fileURLToPath(import.meta.url));
const racine = join(dossierEmoji, '..');

// Couleurs figées dans les fichiers autonomes (identiques à style.css).
const couleurs = [
    [/var\(--ds-accent,\s*#a6404e\)/g, '#a6404e'],
    [/var\(--ds-soft,\s*#ddccb4\)/g, '#ddccb4'],
    [/var\(--ds-paper,\s*#f7f4ef\)/g, '#f7f4ef'],
    [/currentColor/g, '#161616']
];

// Nom de fichier et intitulé de chaque emoji.
const fiches = {
    'ds-fleche': ['fleche', 'Flèche aiguille', 'signes'],
    'ds-fleche-bas': ['fleche-bas', 'Flèche vers le bas', 'signes'],
    'ds-fleche-haut': ['fleche-haut', 'Flèche vers le haut', 'signes'],
    'ds-epingles': ['epingles', 'Épingles croisées', 'signes'],
    'ds-bouton': ['bouton', 'Bouton de couture', 'signes'],
    'ds-etoile': ['etoile', 'Étoile Défi’style', 'signes'],
    'ds-etoile-pleine': ['etoile-pleine', 'Étoile pleine', 'signes'],
    'ds-etincelle': ['etincelle', 'Étincelle', 'signes'],
    'ds-cintre': ['cintre', 'Cintre', 'mode'],
    'ds-robe': ['robe', 'Robe', 'mode'],
    'ds-sac': ['sac', 'Sac', 'mode'],
    'ds-chapeau': ['chapeau', 'Chapeau', 'mode'],
    'ds-ciseaux': ['ciseaux', 'Ciseaux', 'mode'],
    'ds-aiguille': ['aiguille', 'Aiguille et fil', 'mode'],
    'ds-bobine': ['bobine', 'Bobine de fil', 'mode'],
    'ds-appareil-photo': ['appareil-photo', 'Appareil photo', 'mode'],
    'ds-podium': ['podium', 'Podium', 'mode'],
    'ds-rouge': ['rouge-a-levres', 'Rouge à lèvres', 'mode'],
    'ds-lunettes': ['lunettes', 'Lunettes', 'mode'],
    'ds-coeur': ['coeur', 'Cœur cousu', 'mode'],
    'ds-ticket': ['ticket', 'Billet', 'mode'],
    'ds-calendrier': ['calendrier', 'Calendrier', 'mode'],
    'ds-enveloppe': ['enveloppe', 'Enveloppe', 'mode'],
    'ds-instagram': ['instagram', 'Instagram', 'mode'],
    'ds-lieu': ['lieu', 'Repère de ville', 'mode']
};

const source = readFileSync(join(dossierEmoji, 'defistyle-emoji.svg'), 'utf8');
const symboles = [...source.matchAll(/<symbol id="([^"]+)" viewBox="([^"]+)">([\s\S]*?)<\/symbol>/g)]
    .map(([bloc, id, viewBox, contenu]) => ({ id, viewBox, bloc, contenu: contenu.trim() }));

if (symboles.length === 0) throw new Error('Aucun <symbol> trouvé dans defistyle-emoji.svg');

const inconnus = symboles.filter((s) => !fiches[s.id]).map((s) => s.id);
if (inconnus.length) throw new Error(`Emoji sans fiche dans generer-emoji.mjs : ${inconnus.join(', ')}`);

// 1. Un fichier SVG autonome par emoji.
for (const { id, viewBox, contenu } of symboles) {
    const [nom, intitule] = fiches[id];
    const dessin = couleurs.reduce((texte, [motif, valeur]) => texte.replace(motif, valeur), contenu);
    const fichier = [
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="256" height="256" role="img" aria-label="${intitule}">`,
        `    <title>Défi’style — ${intitule}</title>`,
        dessin.split('\n').map((ligne) => `    ${ligne.trim()}`).join('\n'),
        '</svg>',
        ''
    ].join('\n');
    writeFileSync(join(dossierEmoji, `${nom}.svg`), fichier);
}

// 2. Le jeu complet recopié dans les pages HTML.
const jeuInline = [
    '    <!-- ds:emoji:start — généré par emoji/generer-emoji.mjs, ne pas éditer à la main -->',
    '    <svg class="ds-jeu" width="0" height="0" aria-hidden="true" focusable="false"><defs>',
    ...symboles.map(({ bloc }) => bloc.split('\n').map((ligne) => `    ${ligne}`).join('\n')),
    '    </defs></svg>',
    '    <!-- ds:emoji:end -->'
].join('\n');

for (const page of ['index.html', 'site.html']) {
    const chemin = join(racine, page);
    let html;
    try {
        html = readFileSync(chemin, 'utf8');
    } catch {
        console.warn(`· ${page} absent, ignoré`);
        continue;
    }
    const zone = /[ \t]*<!-- ds:emoji:start[\s\S]*?<!-- ds:emoji:end -->/;
    if (!zone.test(html)) {
        console.warn(`· ${page} : balises ds:emoji introuvables, ignoré`);
        continue;
    }
    writeFileSync(chemin, html.replace(zone, jeuInline));
    console.log(`· ${page} mis à jour`);
}

// 3. La planche d'aperçu.
// Le jeu y est recopié comme dans les pages du site : Chrome ne sait pas
// suivre un <use href="fichier.svg#id"> vers un fichier extérieur.
const carte = ({ id }) => {
    const [nom, intitule] = fiches[id];
    return `        <figure class="case"><svg class="ic" aria-hidden="true"><use href="#${id}"></use></svg><figcaption>${intitule}<small>emoji/${nom}.svg</small></figcaption></figure>`;
};
const groupe = (cle) => symboles.filter(({ id }) => fiches[id][2] === cle).map(carte).join('\n');

writeFileSync(join(dossierEmoji, 'apercu.html'), `<!doctype html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Les emoji Défi'style</title>
<style>
:root { --ink:#161616; --paper:#f7f4ef; --sand:#ddccb4; --accent:#a6404e; --muted:#77716a;
        --ds-accent:var(--accent); --ds-soft:var(--sand); --ds-paper:var(--paper); }
* { box-sizing:border-box; margin:0; padding:0 }
body { padding:56px 40px 80px; background:var(--paper); color:var(--ink);
       font:400 14px/1.7 Montserrat, Arial, sans-serif }
h1 { max-width:14ch; margin-bottom:14px; font:500 clamp(2.6rem,6vw,4.4rem)/.95 'Bodoni Moda', serif; letter-spacing:-.05em }
h1 em { color:var(--accent) }
.intro { max-width:46ch; color:var(--muted); font-size:12px }
h2 { margin:56px 0 22px; padding-top:20px; border-top:1px solid rgba(22,22,22,.15);
     color:var(--accent); font-size:10px; font-weight:700; letter-spacing:2.3px; text-transform:uppercase }
.ds-jeu { position:absolute; width:0; height:0; overflow:hidden }
.planche { display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:1px; background:rgba(22,22,22,.14) }
.case { display:flex; flex-direction:column; align-items:center; gap:16px; padding:30px 14px; background:#fff; text-align:center }
.case.sombre { background:var(--ink); color:var(--paper); --ds-accent:var(--sand); --ds-soft:#c6ae91; --ds-paper:var(--ink) }
.ic { width:52px; height:52px }
figcaption { display:flex; flex-direction:column; gap:5px; font-size:11px; font-weight:600 }
small { color:var(--muted); font-size:9px; font-weight:400; letter-spacing:.4px }
.case.sombre small { color:rgba(247,244,239,.55) }
.bascule { display:inline-flex; gap:9px; align-items:center; margin-top:26px; padding:11px 17px;
           border:1px solid var(--ink); background:transparent; cursor:pointer;
           font:700 10px/1 Montserrat, sans-serif; letter-spacing:1.4px; text-transform:uppercase }
</style>
</head>
<body>
${jeuInline}
    <h1>Les emoji <em>Défi'style.</em></h1>
    <p class="intro">Notre alphabet de signes : dessiné pour la maison, aux couleurs de la maison. Chaque case renvoie au fichier SVG à utiliser.</p>
    <button class="bascule" type="button" onclick="document.querySelectorAll('.case').forEach(c=>c.classList.toggle('sombre'))">Voir sur fond foncé</button>

    <h2>Les signes</h2>
    <div class="planche">
${groupe('signes')}
    </div>

    <h2>Les emoji mode</h2>
    <div class="planche">
${groupe('mode')}
    </div>
</body>
</html>
`);

console.log(`\n${symboles.length} emoji générés dans emoji/ + apercu.html`);
