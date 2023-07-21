# Lancer le projet
## En ligne:
- firebase : https://reporting-app-612f4.web.app/list

## En local
`npm run start` & `json-server --watch db.json`

# Ce qui n'est pas géré
- Les codes http
- Limitation à un seul signalement par adresse mail.

# Choix techniques
Pour réaliser l'exercice, j'ai décidé de mettre en place plusieurs concepts liés au framework.

Sur les 2 pages:
- Mise en place du patterne View Model:
    - Code déclaratif et réactif.
    - S'associe très bien au ChangeDetectionStrategy.OnPush, qui permet de limiter de régénérer la vu à chaque fois qu'il y a un changement dans Angular.
    - Permet d'avoir une seule source de 'vérité'.
    - Avec l'utilisation du pipe `| async`, cela gère correctement la destruction de l'observable et évite des memory leak
    - Par contre cela nécessite une compréhension de plusieurs concepts RxJs.

- Pour la gestion des erreurs, j'ai créé un opérateur RxJs personnalisé `getErrorMessage` qui me permet de récupérer le message d'erreur lors de la récupération de données.

## Page liste des signalements

### Gestion du responsive
La page affiche soit un tableau avec la liste des signalements, soit des cartes si l'écran est plus petit.
Pour gérer l'affichage en fonction de la taille de l'écran, j'ai mis en place des directives structurelles, `isMobile` et `isNotMobile`.
Sachant que `isNotMobile`, est construite via la composition de directive, cela limite la duplication de code, ou encore l'héritage et favorise la composition.
Ces directives se basent sur une valeur renvoyée par le service `DeviceService`, cette valeur est calculée à chaque fois que la taille de la fenêtre change.
Par contre, chaque événement va déclencher la mise à jour des vues (tick), pour pallier à cela, j'ai fait en sorte qu'Angular déclenche sa mise à jour seulement quand on passe d'une vue mobile à ordinateur, ou l'inverse, en sortant l'écoute de l'évènement de la zone interne.
J'ai aussi instancié `DeviceService` dans les providers de ListComponent pour qu'il arrête d'écouter l'event resize une fois que l'on change de page (C'est une légère optimisation, pas indispensable).

### Contenu projecté
Le tableau de signalement étant créé par un sous-composant, j'ai décidé d'utiliser une technique de contenu projeté pour afficher les boutons dans le tableau. C'est surtout pour illustrer la technique qui permet de la création de composants facilement génériques hautement personnalisables.
De plus, cela ne pouvait pas être fait via `ng-content`, car le sous-composant affiche une liste de signalements ayant chacun besoin d'un bouton avec la redirection vers leur page d'édition associée.
C'est pourquoi j'ai mis en place un `ng-template` dont je récupère la référence via `ContentChild`.

### ng-container
Il y a pas mal de ng-container sur cette page, ces tags ne sont pas créés dans le DOM et on pour but d'organiser la page.

### Pipe
J'ai mis en place le pipe `appJoin`, qui est un pure pipe (ne se déclenche que si au moins une de ses entrées ne change), pour lier les observations entre elles.

## Page d'édition des signalements
### Reactive form
Pour gérer la mise à jour ou la création d'un signalement, j'ai mis en place un `ReactiveForm`. Pour gérer la validité du formulaire, j'ai rajouté des validateurs au sein du ReactiveForm.
J'ai pu utiliser certains validateurs proposés par Angular, et j'ai dû créé 2 validateurs personnalisés.
`minDateValidator` qui vérifie la date mininale n'est pas dépassée (ici 100 ans).
`isMailAlreadyUsed` qui vérifie de façon asynchrone que le mal de l'auteur n'est pas utilisé ailleurs. Comme la réponse est asynchrone et non prise en compte par le viewmodel, j'ai mis en place un opérateur RxJs `markForCheck` pour que la vue soit mise à jour lors de la réception de la réponse.
### CanDeactivate
Pour avertir que l'utilisateur change de page sans avoir sauvegardé, j'ai mis en place le guard canDeactivate.

## Gestion de l'api en fonction de l'environment
Selon, si on est en production, ou en local, l'api appelé n'est pas la même.
J'ai créé un service (ou plutôt une classe abstraite), qui est disponible sous une seule instance à l'ensemble de l'application (providedIn: 'root') et `tree-shakeable`, qui renvoie soit l'api local ou celle du web-storage via useFactory.
L'api local et celle du web-storage implémentent la classe abstraite afin de garantir qu'elles ont bien les méthodes souhaitées.


## Remarques
Certaines parties du code ne sont pas compatibles avec Angular Universal (appel direct au DOM). Mais cela pourrait facilement le devenir.

# Optimisations encore possibles
- Utilisation de signals
- Mettre en place RouteReuseStrategy pour mettre en cache les pages
- Utiliser esbuild en dev pour accélérer le développement (démarrage du projet et recompilation), mais je trouve le comportement un peu bizarre surtout pour une si petite application.

# Stack technique
- Angular 16.1
- Angular material
- Bootstrap 5
- json-server (simuler le backend en local)
- NodeJs v16.17

# Auteur
Romain Geffrault
https://www.linkedin.com/in/romain-geffrault-99540015a/