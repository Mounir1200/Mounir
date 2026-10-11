# Validation du portfolio

La dernière révision est décrite en fin de document. Les sections précédentes conservent l’historique des anciennes versions.

Vérification locale le 2 octobre 2026.

- HTML : aucun identifiant dupliqué, toutes les ancres internes ont une cible.
- Ressources : page, CSS, JavaScript, vidéo, image fixe, portrait et CV servis correctement en HTTP local.
- JavaScript : syntaxe validée avec `node --check app.js`.
- Rendu : accueil, projets, portrait et contact examinés dans le navigateur. Versions de 320, 390, 820, 1280 et 1440 pixels vérifiées pendant la mise au point. Aucun débordement horizontal constaté sur les petits écrans.
- Lecteur : lecture automatique muette unique, arrêt en fin de film, relecture, pause et déplacement au clavier dans la barre de progression vérifiés.
- Préférence : le bouton de réduction des animations coupe le mouvement et sa valeur est conservée au rechargement dans la session.
- Interactions : liens internes et ouverture du détail Grant Copilot vérifiés au clic. Les liens externes ne soumettent aucun formulaire.
- Console : aucune erreur de page relevée après intégration du JavaScript.

## Contrôle anti-slop

La vidéo personnelle porte l'ouverture. L'accent vert est limité aux repères et aux interactions ; pas de fausse interface de terminal, de chiffres de performance décoratifs, de témoignages inventés ou de galerie remplie de projets fictifs. Les deux illustrations sont des schémas conceptuels explicitement décrits aux lecteurs d'écran.

Corrections apportées : maintien des mains dans le cadre, adaptation de l'accueil aux tablettes, espace entre les phrases sur mobile, mise à jour silencieuse du compteur vidéo pour les lecteurs d'écran. Le texte et les liens restent disponibles indépendamment de l'animation.

Limites : rendu validé dans le navigateur intégré, sans campagne de tests sur appareils physiques ni mesure Lighthouse. Le respect de `prefers-reduced-motion` est implémenté ; le test interactif a porté sur le contrôle local de réduction du mouvement. La copie en ligne du portfolio n'a pas été changée.

## Révision de l'ouverture : vidéo de fond et descente automatique

- Le film couvre toute la hauteur et la largeur du premier écran (`100svh`, `object-fit: cover`), y compris sur téléphone.
- Lecture silencieuse automatique confirmée sur une arrivée en haut de page.
- Fin naturelle confirmée à 10,147 secondes, suivie d'une descente vers la présentation : sur une fenêtre de 900 pixels de hauteur, `scrollY` atteint 900 et la section suivante est alignée en haut.
- Une touche de défilement annule l'avance automatique et le lien affiche « Découvrir la suite ».
- Le nom a été réduit et placé en bas pour laisser le visage et le geste porter l'ouverture. La navigation se superpose au film.
- Le poster initial est désormais une image du début de la vidéo pour éviter d'afficher la galaxie avant son apparition.


## Révision cobalt, pêche et brun

- Les couleurs du CSS et du favicon se limitent à #6c2b11, #f2ad78, #0057ba et à leurs transparences. La photographie conserve une carnation naturelle et des nuances photographiques ; la vidéo existante attend une nouvelle génération.
- Space Grotesk et Instrument Serif sont servis localement avec leurs licences OFL. Leur chargement a été confirmé dans le navigateur.
- Nouveau portrait IA intégré : portrait-cobalt-peche.png, 1122 × 1402. Cadrage vérifié sur ordinateur et téléphone.
- Contraste brun/pêche : 5,54:1. Le couple bleu/pêche, 3,59:1, est réservé aux grands textes et aux graphismes ; les petits textes des blocs bleus sont bruns sur pêche.
- Vérifications visuelles à 1440 × 900, 900 × 520, 400 × 860, 390 × 844 et 320 × 780. Aucun débordement horizontal constaté aux tailles contrôlées.
- Correction mobile : illustrations carrées jusqu'à 480 px et annotations remontées pour éviter le chevauchement de la légende. Après correction, environ 9 px séparent Session 03 de la légende à 320 px.
- Focus des commandes vidéo renforcé : contour brun et anneau pêche ; vérifié au clavier sur le bouton Revoir.
- Navigation Parcours/Projets/Contact vérifiée, ressources locales présentes, aucune erreur de console relevée.

### Contrôle anti-slop

La vidéo personnelle conserve le rôle central. La palette demandée remplace complètement l'ancienne palette de l'interface. Les deux familles typographiques distinguent structure technique et accents éditoriaux ; les schémas restent liés aux deux projets réels. Aucun contenu ou indicateur fictif ajouté. Le nouveau prompt vidéo et sa variante verticale sont conservés dans PROMPT-VIDEO-COBALT-PECHE.md.

Lecture automatique silencieuse et descente à la fin du film reconfirmées sur une nouvelle visite : fin à 10,147 s, scrollY = 720 et présentation alignée à 0 px dans une fenêtre de 720 px de hauteur. Un onglet déjà manipulé ne sert pas de preuve pour une première visite, car les commandes manuelles désarment la descente.

## Révision actuelle : affiche vivante et motion design

La vidéo de fond a été remplacée par une affiche animée. Le film cosmique est désormais une exploration à lecture manuelle plus bas dans la page.

### Rendu et contenu

- Accueil : grand nom typographique, portrait cobalt/pêche, grille et orbites. Séquence coordonnée de 6,5 secondes, pause/reprise et relecture.
- Deux familles locales conservées : Space Grotesk et Instrument Serif. Aucun changement des faits professionnels ni ajout de résultats fictifs.
- Bande XXL « Imaginer / Construire / Relier », déplacements et inclinaisons liés au défilement, survols et ouverture animée des détails.
- Navigation interne : trois volets de couleur et titre de destination, puis arrivée à l’ancre. Le contenu reste accessible indépendamment de l’effet.
- Palette CSS contrôlée : uniquement #6c2b11, #f2ad78, #0057ba et leurs transparences.
- Contrôle visuel dans le navigateur intégré à 1440 × 900, 390 × 844 et 320 × 780. Accueil, projets, présentation, parcours et contact examinés. Aucun débordement horizontal constaté aux dimensions contrôlées.
- Corrections pendant la mise au point : dimension intrinsèque du portrait dans sa grille, largeur des grands noms à 320 px, largeur des illustrations sur mobile, centrage indépendant du mot des transitions.

### Interactions vérifiées

- Transition Projets : activation, arrivée à #projets, fermeture complète de l’overlay et progression des planches mise à jour.
- Échap pendant le passage vers Parcours : overlay immédiatement fermé, pas de navigation tardive.
- Navigation Parcours avec Entrée : arrivée à #portrait et focus transféré à cette section.
- Mode réduit : aucune animation de la bande, aucune transition couvrante, navigation immédiate, préférence conservée après rechargement. Mode normal restauré après vérification.
- Navigation clavier dès une nouvelle arrivée : Tab désarme l’avance ; après la fin de l’intro, scrollY reste à 0.
- Bande typographique observée en mouvement lorsqu’elle est visible sur mobile ; les illustrations cessent leurs mouvements hors écran.
- Ouverture de Grant Copilot, lecture manuelle du film et pause de celui-ci hors écran vérifiées durant cette révision.

### Contrôles techniques

- `node --check app.js` réussi après l’intégration finale.
- Aucun identifiant dupliqué, aucune cible d’ancre ni ressource locale manquante ; accolades CSS équilibrées.
- Audit du nettoyage des animations : promesses annulées prises en charge, sortie avec Échap/Tab/défilement/nouvelle interaction, changement d’onglet, historique et mode réduit ; timeout de secours de 1,8 s.
- Contenu visible sans JavaScript ; préférences de réduction des animations et économie de données prises en charge. Le contrôle interactif porte sur le réglage de session ; pas d’émulation des préférences système.

Limites : contrôles réalisés dans le navigateur intégré, sans appareils physiques ni mesure Lighthouse. Le site reste local.

## Navigation persistante — 2 octobre 2026

- Bouton « Animations actives » retiré du footer, avec son code et ses styles. Les anciennes préférences de session ne sont plus utilisées ; les préférences système et l’économie de données restent respectées.
- Barre fixée en haut, six destinations : Accueil, Projets, Parcours, Expériences, Film et Contact. Section des expériences dotée de sa propre ancre.
- Six liens visibles sur deux lignes à 320 px, sans débordement horizontal. L’accueil réserve la hauteur de la barre.
- Passage Projets → Expériences vérifié : titre de destination dans la transition, bonne ancre et lien actif. Début de section à 88 px sous une barre de 72 px sur ordinateur, à 120 px sous une barre de 104 px sur mobile.
- Retour Accueil vérifié depuis les expériences : scrollY = 0, Accueil actif, overlay fermé.
- Syntaxe JavaScript validée, aucun identifiant dupliqué et toutes les ancres résolues.

## Récit, galerie, curseur et accueil Hello — 2 octobre 2026

- Ordre des chapitres : accueil, introduction, formation/parcours, expériences chronologiques, projets personnels, galerie, contact. Navigation réordonnée et liens éditoriaux entre les étapes.
- Chronologie : Moov Africa 2024, stage ESSCA 2025, PFE 2025–2026, poste ESSCA depuis avril 2026. Les faits professionnels existants ont été repris ; aucun résultat chiffré ni épisode biographique ajouté.
- Film remplacé par quatre photographies fournies : remise de diplôme, quai, quotidien et portrait original. Aucun élément vidéo dans la page. Les anciennes ancres du film mènent à la galerie.
- Galerie et visionneuse vérifiées sur ordinateur et à 390 × 844 : image entière, légendes, compteur, suivant, flèche gauche, Échap, fermeture et focus rendu à la miniature. Le défilement est débloqué à la fermeture.
- Hello observé au chargement avec hero encore idle, puis écran masqué et intro achevée. Typographie italique sur fond pêche, apparition 850 ms, attente jusqu’à 1,4 s et retrait 650 ms ; sortie de secours CSS à 2,6 s.
- Traînée du curseur vérifiée avec un déplacement réel dans le navigateur : chemin SVG produit, opacité 0,62 pendant le mouvement, puis data-active=false et opacité0 au repos. Curseur natif conservé et aucune interception du pointeur.
- Préférences système/saveData : réduction des mouvements prise en charge ; le curseur est également désactivé pour les interfaces tactiles, les champs d’édition et les dialogues ouverts. Audit source de ces conditions, sans émulation de préférence système.
- Vérifications statiques : aucun ID dupliqué, ressource absente ou ancre invalide ; syntaxe des deux scripts validée et styles équilibrés.
- Contrôle supplémentaire à 320 × 780 : Hello visible sans débordement, migration #film → #galerie pendant l’accueil puis arrivée à Galerie avec overlay fermé. Les largeurs de page observées restent inférieures à la fenêtre.

## Échanges et hobbies — 3 octobre 2026

- Deux albums intégrés au chapitre Parcours : KTU / Lituanie (2023) et RWU / Allemagne (2024–2025), trois photos chacun. La photo de 2025 également présente dans le dossier Lituanie n’a pas été retenue pour illustrer l’échange de 2023.
- Nouveau chapitre Hobbies après les projets : photographie au Pixel (trois photos), jeux vidéo et mangas (FC 25, PGR × Devil May Cry, ROG Xbox Ally X), lecture (les deux passages fournis), musique et musculation.
- Citation de la page 99 : attribution à Dostoïevski non vérifiée ; formulation de la légende limitée à un passage retenu de son exemplaire. Aucun auteur de postface supposé dans le site.
- Douze sources converties en copies WebP pour le site ; originaux intacts, couleurs naturelles préservées, sources consignées dans assets/life/sources.json. Miniatures au chargement différé ; versions agrandies demandées par la visionneuse.
- Contrôle visuel sur ordinateur (1440 × 1000), téléphone (390 × 844) et petit écran (320 × 780). Sept liens disponibles en permanence, sans débordement horizontal constaté à 320 px. Ancre Hobbies à 88 px sur ordinateur et 120 px sur téléphone sous la barre fixe.
- Visionneuse Photographie : passage de 2/3 à 3/3 puis 1/3 vérifié, images et légendes cohérentes. Échap ferme et restaure le focus sur la miniature d’origine, défilement débloqué.
- Visionneuse Allemagne : précédent depuis 1/3 donne le tableau de cours 3/3 ; image entière et commandes visibles à 320 px. Visionneuse Lituanie : flèche droite donne le match de basket 2/3. Chaque album reste indépendant.
- Vérifications statiques : aucune ancre ou ressource locale manquante, aucun identifiant dupliqué, toutes les images ont un texte alternatif, styles équilibrés, syntaxe des scripts valide. Aucun élément vidéo présent dans la page.
- Réduction des animations conservée dans les styles et les interactions ; pas d’émulation système effectuée pendant cette révision. Aucun déploiement public.
- Complément : album Jeux vérifié (PGR × Devil May Cry → FC 25, compteur 2/3), fermeture correcte et aucune erreur de console relevée.

## Photographie — éventail continu, 3 octobre 2026

- Ancienne grille de trois images remplacée par les 16 photographies du dossier fourni. Ordre et sources détaillés dans assets/life/photography.json ; couleurs originales conservées.
- Mise en scène en éventail inspirée de la référence 21st.dev donnée par Mounir : tirages qui glissent continuellement, échelle et angle progressifs autour de l’image centrale. Palette existante conservée, aucun contenu de démonstration réutilisé.
- Défilement observé en marche (compteur 02 → 08 et transformations évolutives), pause immobile confirmée entre deux observations, reprise confirmée. Boutons précédent/suivant vérifiés sur la jonction 01 → 16 → 01.
- Clavier : flèche droite depuis l’image centrale, transfert du focus sur la nouvelle photo confirmé. Home utilise le chemin circulaire le plus court. Le texte annoncé n’est actualisé à voix haute que pour une action manuelle.
- Visionneuse : 16 images du groupe Photographie, passage à 2/16, fermeture par Échap, défilement débloqué et focus restauré sur le tirage d’origine, lequel revient au centre. Vérifié après la dernière correction du retour de focus à 320 px.
- Glissement horizontal réel testé au pointeur dans le navigateur : changement de photo, sortie propre du drag, aucune ouverture accidentelle de la visionneuse. Défilement vertical tactile préservé par touch-action:pan-y ; pas de validation sur téléphone physique.
- Rendu vérifié sur ordinateur (1280 px), à 390 × 844 et à 320 × 780. Aucune extension de la largeur de page à 320/390 px ; commandes de 44 px visibles sur petit écran, légendes et images lisibles.
- Arrêt automatique hors écran, onglet masqué, dialogue ouvert et réduction du mouvement : conditions auditées dans le code. Réduction système et fallback sans JavaScript non émulés dans le navigateur pendant cette révision.
- Relecture indépendante : relâchement de souris hors du carrousel pris en charge pour éviter un drag bloqué ; Home/End corrigés pour éviter un tour presque complet à la jonction de la boucle.
- Validation technique : 16 cartes, 16 sources de photos, aucune ancre, ressource ou ID invalide ; syntaxe JavaScript valide, accolades CSS équilibrées, aucune erreur de console relevée. Les anciens styles de la grille photo ont été retirés.
- Environ 1,16 Mio pour les 16 miniatures ; chargement des grands formats seulement à l’ouverture. JavaScript et CSS natifs, aucune bibliothèque ajoutée.

## Préparation GitHub Pages — 3 octobre 2026

- Références statiques vérifiées pour le chemin de projet /Mounir/ : casse correcte, aucun asset ou ancre manquant, aucun chemin localhost dans le code livré.
- Script de publication scripts/build_site.py : 70 fichiers liés + .nojekyll, environ 11,86 Mio. Les sources de travail et anciens essais vidéo sont exclus de l’artefact publié.
- Syntaxe des trois scripts JavaScript vérifiée. Workflow GitHub Actions avec build puis déploiement Pages et permissions séparées.
- Dépôt local initialisé dans portfolio/ seulement ; fichiers d’origine du dossier parent conservés hors dépôt.

## Fond sonore — 3 octobre 2026

- MP3 fourni copié à l’identique (SHA-256 vérifié) dans assets/audio/positive-chill-hop.mp3 ; original conservé. Ressource HTML relative publiée automatiquement par le build.
- Lecture en boucle native, durée mesurée dans le navigateur : 120,792 s. Retour observé de 114 s à 21 s avec lecture toujours active et ended=false.
- Gain Web Audio de 0,18 avant lecture, repli audio.volume=0,18. Volume système indépendant ; aucun test d’écoute ou sur Safari/iPhone physique effectué.
- Arrivée sans geste : refus d’autoplay géré, état prêt et aucun faux indicateur actif. Premier clic de navigation : lecture et indicateurs actifs. Navigation interne et galerie sans remise à zéro.
- Pause, rechargement et navigation : silence conservé. Reprise depuis la commande de la galerie, commandes synchronisées ; bascules rapides contrôlées et aucune erreur console.
- Bouton fixe de 44 px et contrôle de visionneuse vérifiés à 1280 px et 390 × 844, sans débordement horizontal. Animations des icônes liées à la lecture et respect du mouvement réduit audités dans le code.
- Relecture indépendante : ajout de audio.load() uniquement après erreur de source, et effacement du message d’erreur à la reprise effective.
- Syntaxe des quatre scripts vérifiée, git diff --check valide. Build : 73 ressources + .nojekyll, 15,55 Mio, dont MP3 et fichiers music.js/music.css.

## Modes FR/EN et CV — 3 octobre 2026

- 366 chaînes statiques couvertes par translations.js (dont noms/symboles conservés) et 45 libellés dynamiques dans dynamic-translations.js. Couverture HTML contrôlée : aucune clé manquante ni traduction vide.
- Détection testée pour fr-FR/fr-CA/en-GB/en-US et préférences multiples, repli anglais, priorité URL puis choix mémorisé, stockage bloqué, changement répété FR→EN→FR et conservation des paramètres/ancre. Ces contrôles sont exécutés par scripts/check_i18n.cjs dans GitHub Actions.
- Les PDF fournis ont été copiés sans modification. Téléchargement réel des CV EN et FR dans le navigateur ; SHA-256 des téléchargements identiques aux fichiers sources : EN 465FC7E0C19052570191A4B52FBC00D2AEA53DC60F5DCDD92C3D3904562243B1 ; FR AC21810B34E61B50AEFDC4B187A6997B3EEAC875DECFF72EC894643FA6442297.
- Les deux liens CV changent de cible et de nom de téléchargement selon la langue. Les deux PDF sont inclus dans le build, y compris la cible EN déclarée dans data-cv-en.
- Version anglaise vérifiée dans le navigateur : accueil, titres, navigation, photo courante, légende/date, commandes audio et carrousel. Sélection par Entrée et choix EN conservé lors d’une navigation sans paramètre lang.
- Bascule de langue pendant la lecture : audio toujours actif, temps de lecture croissant. Carrousel en pause conservé sur 01/16 ; titre et commandes traduits. Bascule dans la visionneuse : même src, même photo et compteur, titre/alt/légende mis à jour.
- Affichage contrôlé à 1280 × 800 et 320 × 780. Espace réservé sous l’accueil pour les commandes fixes. Barre de galerie corrigée à 320 px (fermeture par icône avec nom accessible), aucune largeur excédentaire. Pas de test sur téléphone physique.
- Syntaxe JavaScript et diff validés ; aucune erreur console relevée. Build : 78 ressources + .nojekyll, 15,71 Mio.

## Corrections UI/UX — 11 octobre 2026

- Projets placés après l’accueil, avec deux appels à l’action explicites. Les schémas UrdWell et HindSight présentent des cas de tests publics liés à leur source ; ces tests distants n’ont pas été exécutés.
- Commandes de langue et de musique déplacées dans l’en-tête. Menu compact, navigation au clavier, fermeture par Échap et retour du focus vérifiés, y compris au changement de largeur et après téléchargement du CV.
- Aucun défilement automatique après dix secondes sur l’accueil. Musique silencieuse et aucune requête MP3 avant activation explicite, même avec une ancienne préférence active ; lecture et pause vérifiées.
- Galerie : chargement retardé et erreur HTTP simulés, traduction FR/EN de l’erreur, réessai réussi, flèches et restauration du focus vérifiés. Le bouton suivant de l’éventail et les légendes sont dégagés.
- Captures et interactions contrôlées dans Edge via Playwright à 1440 × 1000, 768 × 1024, 390 × 844 et 320 × 780 ; aucun débordement horizontal ni erreur JavaScript relevés. Mode de mouvement réduit, version anglaise et navigation sans JavaScript vérifiés. Aucun essai sur téléphone physique.
- Portrait WebP responsive : 43 172 octets à 560 px et 199 924 octets à 1122 px, contre 2 172 811 octets pour le PNG conservé. Chargement de l’image et inclusion des variantes dans le site construit vérifiés.
- Syntaxe des huit scripts JavaScript, contrôle i18n et git diff --check validés. Build : 81 fichiers liés + .nojekyll, 13,88 Mio. Résultats et captures locaux dans .review/ui-ux-update-2026-10-11/.
- Aperçu local préparé ; aucun commit ni déploiement effectué pendant cette correction.

### Liens des projets et cas de test repliables — 11 octobre 2026

- Titres UrdWell/HindSight cliquables et liens « Voir le projet sur GitHub » explicites pour les quatre dépôts connus. Ces quatre destinations répondent HTTP 200. Aucun dépôt public ChartMind identifié sur le compte ; aucune URL inventée.
- Les deux cas de test utilisent details/summary, ouverts au départ et repliables indépendamment. Repli et réouverture par Entrée/Espace, focus conservé et contenu masqué non visible vérifiés dans Edge à 320, 390 et 1440 px, avec libellés FR/EN et sans débordement horizontal.
- Fonctionnement sans JavaScript vérifié à 390 px, rendu mobile stable contrôlé après réouverture, aucune erreur JavaScript observée. Contrôle i18n et build validés.

### Explications des projets — 11 octobre 2026

- Descriptions reformulées autour du problème, de l’approche et de la raison du choix technique ; jargon de recherche et de mémoire expliqué en termes courants. Descriptions des projets secondaires et académiques également clarifiées.
- Cas UrdWell : correction fournie par le test, ancienne version inactive conservée et reliée à la nouvelle. Cas HindSight : facture du 2 juillet, tarif corrigé reçu le 3 mais applicable dès le 1er, écart de 1 €. Source des scénarios et limites vérifiées dans les dépôts publics ; aucune suite de tests distante exécutée.
- Tous les nœuds de texte de la section Projets disposent d’une traduction. Rendu et repli des panneaux contrôlés dans Edge à 320, 390 et 1440 px, en FR/EN ; projets secondaires ouverts et contrôlés, aucun débordement horizontal ni erreur JavaScript. Captures locales dans .review/ui-ux-update-2026-10-11/clear-*.png.

- Complément : Grant Copilot, ADQUA et ChartMind présentent désormais le public, le besoin et le fonctionnement en deux paragraphes simples, sans rubrique technique ni cas de test. Catégories reformulées par usage. Projets académiques inchangés pendant ce complément. Couverture FR/EN, ouverture des trois fiches et absence de débordement vérifiées à 320, 390 et 1440 px ; build et contrôle i18n validés.

- Fin du contrat ESSCA communiquée par Mounir : vendredi 9 octobre 2026. La chronologie affiche « Avril — octobre 2026 » / « April — October 2026 », à la place de « présent » / « present », en conservant la précision au mois utilisée pour les expériences.

### Missions professionnelles — 11 octobre 2026

- Constat : les quatre expériences se limitaient à une phrase technique. Décision : chronologie de la plus récente à la première, poste/entreprise/dates/objectif toujours visibles, volets « Voir mes missions » pour les tâches concrètes et l’environnement technique. La dernière expérience ESSCA est ouverte initialement ; les quatre volets restent indépendants.
- Les missions ESSCA proviennent des deux CV fournis, lus sans modification ; la fin du contrat d’octobre 2026 conserve la correction de Mounir. Pour Moov Africa, absent de ces CV, seuls les faits déjà présents dans le portfolio sont développés. Aucun résultat chiffré ajouté.
- Vérifications Edge : ordre des quatre expériences, état initial, ouverture/fermeture Entrée et Espace, maintien du focus, indépendance des volets et masquage du contenu replié. Lecture et ouverture possibles sans JavaScript. Couverture des textes et commandes FR/EN contrôlée.
- Rendu vérifié à 1440, 768, 390 et 320 px ; aucun débordement horizontal ni erreur JavaScript. Captures missions-initial-*.png et missions-en-*.png dans .review/ui-ux-update-2026-10-11/. Contrôle i18n et build validés.

### Correction du chargement des styles de missions — 11 octobre 2026

- La capture utilisateur montrait une liste numérotée sans les styles de la chronologie et les deux libellés « Voir / Replier » simultanément. Le serveur délivrait bien le nouveau CSS ; les vérifications précédentes utilisaient un navigateur neuf et ne couvraient pas le mélange avec une ancienne ressource en cache.
- Ajout d’une version de contenu aux URLs experience.css et translations.js. Les fichiers sont désormais demandés sous une nouvelle adresse ; le build accepte et conserve ces paramètres.
- Régression reproduite avec l’ancien CSS servi avec une heure de cache. Dans le même onglet, navigation vers le HTML corrigé : nouveau CSS effectivement demandé, disparition des numéros natifs et un seul libellé visible par commande. Aperçu réel revérifié à 622 px (proche de la capture), 390 et 1440 px sans débordement. Le cache exact du navigateur intégré n’a pas été inspecté directement.
- Script de reproduction et captures avant/après conservés dans .review/ui-ux-update-2026-10-11/check-missions-cache.cjs et missions-cache-before.png / missions-fixed-*.png.

### Technologies des expériences — 11 octobre 2026

- Une courte liste de technologies, approches ou sujets reste visible sous chaque résumé lorsque les missions sont repliées. Les outils détaillés sont rattachés aux missions concernées ; les anciens blocs finaux « Environnement technique » sont retirés. Les associations respectent les CV et les faits déjà documentés pour Moov Africa.
- Vérification Edge en FR/EN à 320, 390, 622, 768 et 1440 px : ordre résumé/technologies/commande, visibilité des technologies après repli, masquage des précisions, ouverture et fermeture au clavier, maintien du focus et absence de débordement horizontal. Aucune erreur JavaScript relevée. Repli sans JavaScript vérifié à 390 px.
- Captures ouvertes et repliées contrôlées sur mobile et ordinateur ; script check-technology.cjs et captures technology-*.png dans .review/ui-ux-update-2026-10-11/. Versions de contenu CSS/traductions et réponses HTTP vérifiées. Syntaxe JavaScript, contrôle i18n et build validés.

- Ajustement demandé par Mounir : Python et RAG apparaissent en tête des trois listes ESSCA. Les mentions Azure restent dans les missions concernées ; le doublon sous la mission de déploiement du PFE est supprimé. Contrôle FR/EN à 390 et 1440 px : listes visibles après repli, aucun débordement ; contrôle i18n validé. Captures python-rag-*.png dans le même dossier.
