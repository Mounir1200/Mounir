# Mounir DABIRE — affiche vivante

Portfolio local d’ingénieur IA. La création du site pourra faire l’objet d’une publication sur les réseaux ; le site présente le parcours et les projets de Mounir.

## Lancer

Site statique, sans build ni dépendance JavaScript. Servir ce dossier avec `python -m http.server 4173 --bind 127.0.0.1`, puis ouvrir `http://127.0.0.1:4173/`.

## GitHub et déploiement

Dépôt public : https://github.com/Mounir1200/Mounir

GitHub Pages : https://mounir1200.github.io/Mounir/

Chaque push sur `main` lance `.github/workflows/pages.yml` : vérification des scripts, préparation du dossier `_site`, puis publication via GitHub Actions. Un lancement manuel est aussi disponible dans Actions. Le site et le dépôt sont publics ; ce choix permet d’utiliser GitHub Pages avec l’abonnement actuel.

Pour vérifier le contenu publié localement : `python scripts/build_site.py`. Le script copie uniquement la page, ses ressources liées et les licences des polices. Il vérifie les fichiers et les ancres, conserve les chemins relatifs compatibles avec `/Mounir/`, puis ajoute `.nojekyll`. Les documents de travail, manifestes de sources, captures de contrôle et anciens essais vidéo ne sont pas publiés.

## Direction

Une entrée « Hello » en italique, puis une affiche de studio cinétique : grand nom sur pêche et portrait dans un cadre cobalt. Le récit suit la formation de Ouagadougou à Angers, les expériences dans leur ordre chronologique, les projets personnels puis quelques photos. Des transitions éditoriales relient les chapitres. Palette imposée : brun #6c2b11, pêche #f2ad78, bleu #0057ba. Texte courant brun/pêche (contraste 5,54:1) ; bleu/pêche réservé aux grands caractères et graphismes (3,59:1). Les photos de la galerie conservent leurs couleurs d’origine.

Space Grotesk et Instrument Serif sont servis depuis `assets/fonts/`, avec licences OFL. Le portrait `assets/portrait-cobalt-peche.png` a été généré avec imagegen ; l’original reste dans `assets/portrait.jpg`, les prompts sont conservés dans assets.

## Musique de fond

Musique : [« Positive Chill-Hop » de ZephiraMusic, sur Pixabay](https://pixabay.com/fr/music/beats-positive-chill-hop-595886/). La page du morceau indique une utilisation sous la [licence de contenu Pixabay](https://pixabay.com/service/license-summary/).

Le fichier du site est `assets/audio/positive-chill-hop.mp3`. La piste dure environ 2 min 01 s et joue en boucle ; le gain est fixé à 18 % via Web Audio (repli sur `audio.volume` si indisponible), indépendamment du défilement et des animations.

Un essai de lecture est effectué à l’arrivée. Si le navigateur bloque l’audio automatique, le premier clic/toucher ou Entrée/Espace lance la lecture. Le bouton fixe permet de couper et reprendre au même endroit ; le choix est conservé dans le stockage local. Une commande synchronisée reste disponible dans la visionneuse photo. Les indicateurs reflètent la lecture réelle ; leurs animations respectent la réduction des mouvements. Les restrictions du navigateur/système peuvent suspendre la lecture en arrière-plan.

## Langues et CV

Le portfolio est disponible en français et en anglais. À la première visite, la première langue prise en charge dans les préférences du navigateur est utilisée ; si aucune ne correspond, l’anglais sert de repli. Le sélecteur FR/EN reste visible et mémorise le choix dans localStorage. Les liens `?lang=fr` et `?lang=en` permettent également de partager une langue précise ; le paramètre explicite est prioritaire sur le choix enregistré.

La bascule se fait sans rechargement : contenus, titres, textes alternatifs, légendes, commandes et messages accessibles sont actualisés sans recréer la page. La musique, les photos et l’introduction conservent leur état. Les chaînes françaises de `index.html` servent de clés à `translations.js` ; les libellés générés par JavaScript figurent dans `dynamic-translations.js`. Ajouter une traduction lors de toute modification de texte.

Les deux liens « Mon CV / My CV » téléchargent le fichier de la langue active : `assets/Mounir-DABIRE-CV.pdf` pour le français et `assets/Mounir-DABIRE-CV-EN.pdf` pour l’anglais. Ce sont les PDF fournis le 3 octobre 2026, copiés sans modification. Le build inclut les deux variantes déclarées dans `data-cv-fr` / `data-cv-en`. Sans JavaScript, le contenu français et le téléchargement du CV français restent disponibles.

Contrôle de la sélection et de la mémorisation des langues : `node scripts/check_i18n.cjs` (également exécuté dans GitHub Actions).

## Mouvement

- À l’arrivée, « Hello » s’affiche pendant 1,4 s, puis son écran sort en 650 ms. L’affiche démarre ensuite, une fois le portrait chargé : typographie, cadre, portrait et orbites pendant 6,5 s. Une interaction permet de passer immédiatement l’accueil. En mode réduit, cet accueil est ignoré.
- Une descente de 1,3 s mène ensuite à la présentation. Toute action de navigation ou de défilement, y compris Tab, annule cette avance et peut interrompre une descente en cours.
- Pause/reprise et relecture accessibles dès l’accueil. Une relecture volontaire ne réarme jamais la descente automatique.
- Une bande typographique XXL « Imaginer / Construire / Relier » défile uniquement dans le champ de vision. Les planches de projets tournent et changent légèrement d’échelle avec le défilement sur ordinateur ; elles réagissent aussi au pointeur précis. Les orbites de HindSight s’animent uniquement lorsqu’elles sont visibles.
- Les liens internes déclenchent un passage en trois volets cobalt, pêche et brun d’environ une seconde. Le titre de destination accompagne le changement de section. Échap, une nouvelle interaction, un changement d’onglet ou le mode réduit ferment immédiatement la transition. La navigation au clavier transfère le focus à la section cible.
- Une fine traînée cobalt/pêche accompagne le curseur à la souris et disparaît en moins de 500 ms au repos. Elle s’arrête hors de la page, pendant une saisie et dans la visionneuse. Pas de remplacement du curseur natif.
- Onglet masqué : fin de l’accueil, pause de l’intro, annulation de l’avance automatique. Le mode réduit système et l’économie de données suppriment les mouvements automatiques.
- Tous les contenus restent visibles sans JavaScript et en mode réduit. Le bouton global « Animations actives » a été retiré ; la pause et la relecture de l’intro restent disponibles.

## Navigation

La barre principale reste fixée en haut de l’écran : Accueil, Parcours, Expériences, Projets, Hobbies, Galerie et Contact. Sur téléphone, le monogramme et les sept liens occupent une grille de deux lignes. La section courante est soulignée, et les arrivées par ancre laissent la place nécessaire sous la barre. Depuis n’importe quelle section, Accueil ramène au tout début.

La section `#galerie` remplace le film : quatre photos déjà fournies par Mounir, cadres décalés et agrandissement dans un dialogue natif. Boutons précédent/suivant, flèches du clavier, Échap et retour du focus à la miniature. Sans JavaScript, chaque photo reste un lien direct. Les anciennes ancres `#film` et `#film-details` redirigent vers la galerie.

Les échanges KTU (Lituanie, 2023) et RWU (Allemagne, 2024–2025) ont chacun un album de trois photos dans le parcours. Le chapitre `#hobbies`, après les projets, présente la photographie au Pixel, les jeux vidéo et mangas, la lecture, la musique et la musculation. Les albums restent indépendants dans la visionneuse grâce à `data-gallery-group`.

Les images proviennent des quatre sous-dossiers de `Photos-1-001`. La partie Photographie présente les 16 fichiers de son dossier dans un éventail animé en boucle : déplacement continu, premier plan agrandi, pause au survol et au focus, précédent/suivant, clavier et glissement horizontal. Le bouton Pause permet un arrêt durable. Le mouvement automatique s’arrête hors écran, dans la visionneuse, dans un onglet masqué et avec une préférence de mouvement réduit. Sans JavaScript, les 16 liens restent disponibles dans une grille.

Les copies WebP de présentation (900 px maximum) sont chargées à la demande ; les versions de visionneuse (1 800 px maximum) ne sont demandées qu’à l’ouverture. Les 16 miniatures photo représentent environ 1,16 Mio. Les fichiers originaux restent intacts. `assets/life/sources.json` et `assets/life/photography.json` conservent la correspondance des sources.

Référence visuelle de l’éventail demandée par Mounir : https://21st.dev/@ayushmxxn/components/image-fan-carousel. Implémentation locale en JavaScript/CSS natifs, sans ajouter React, Framer Motion ou une dépendance. Les textes, photos et la direction colorée restent ceux du portfolio.

Les deux citations de lecture viennent du texte fourni par Mounir. Le passage sur le rêveur est présenté avec Dostoïevski, *Les Nuits blanches*. L’auteur exact du passage de la page 99 n’a pas été confirmé : sa légende indique seulement un passage retenu de l’exemplaire lu. La notice BnF https://catalogue.bnf.fr/ark:/12148/cb35591828m confirme une postface de Michel del Castillo dans l’édition Babel 1992, mais ne permet pas à elle seule d’attribuer cette citation.

Les fichiers vidéo et les deux prompts vidéo sont conservés comme archives de travail ; aucun lecteur vidéo n’est présent dans la page.

## Sources

- CV fourni, copié dans `assets/Mounir-DABIRE-CV.pdf` : ESAIP, ESSCA, compétences, contacts et projets principaux.
- Portfolio antérieur : https://mounir1200.github.io/PortFolio/ (observé le 2 octobre 2026), projets complémentaires, Moov Africa et CPGE.
- Dépôts : https://github.com/Mounir1200/urdwell-mcp et https://github.com/Mounir1200/HindSight.

Les illustrations des projets sont des schémas conceptuels, pas des captures de leurs interfaces. Aucun client, témoignage ni chiffre de performance n’est inventé.

## Fichiers

- `index.html` : contenus et structure.
- `style.css` : fondations, polices et composants.
- `landing.css` : affiche et séquence d’ouverture.
- `experience.css` : direction et mouvements des sections suivantes.
- `encore.css` : bande typographique, planches au défilement et survols.
- `transitions.css` : volets de navigation et mise en scène de l’affiche.
- `gallery.css` : photos et visionneuse.
- `narrative.css` : chapitres, liens entre les étapes, accueil Hello et couche du curseur.
- `life.css` : albums Erasmus, hobbies, citations et navigation mobile à sept liens.
- `photography.css` et `photography.js` : éventail photo continu, commandes, glissement et repli en grille.
- `music.css` et `music.js` : fond sonore en boucle, volume discret et contrôles synchronisés.
- `language.css`, `i18n.js`, `translations.js` et `dynamic-translations.js` : sélecteur FR/EN, préférences, traduction et choix du CV.
- `app.js` : état de l’intro, défilement, contrôles, visibilité, préférences et pointeur.
- `cursor.js` : traînée SVG à durée limitée, uniquement au mouvement de la souris.
- `VALIDATION.md` : vérifications et limites.

Les fichiers d’origine dans le dossier parent ne font pas partie du dépôt. Les anciens essais vidéo restent locaux et sont ignorés par Git.
