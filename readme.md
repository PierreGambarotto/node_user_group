Application de gestion d'utilisateurs et de groupe
--------------------------------------------------

Ce document présente les différentes étapes de conception et de réalisation d'un projet
d'application web.

Gestion utilisateur
===================

La première partie consiste à gérer une base d'utilisateur.

Pour commencer, on commence par imaginer les différentes vues de l'application
et leur enchaînement, ce qui permet de dégager différents scénarios d'utilisation.

L'objectif final est d'obtenir une description de chacune des vues de
l'application :

* description sommaire du contenu de la vue
* URL permettant d'obtenir cette vue
* URL générées par la manipulation de cette vue (lien `<a href="…">`, validation
de formulaire, requête AJAX)
* éléments HTML significatif de la vue

Les URLs permettent de dégager la description du routage de l'application.
(association requête HTTP <-> action d'un contrôleur).

Les éléments HTML permettent de spécifier le contenu du template devant
engendrer la vue correspondante.

Les vues concernant la création et l'édition d'une ressource permettent de
décrire les modèles qui seront utilisés.

Pour une application permettant de gérer le CRUD d'un modèle, nous obtenons de
manière systématique les vues et le routage ci-dessous. À vous d'adapter pour
une ressource différente.

### `GET /people`

* liste des utilisateurs, sous la forme `nom prénom login`. Pour chaque
utilisateur, des liens permettent de visualiser (GET /people/:id), effacer
(DELET /people/:id), éditer (GET /people/:id/edit) l'utilisateur.  
* un lien/bouton permet de générer `GET /people/new` pour obtenir le formulaire
de création d'un nouvel utilisateur.

### `GET /people/new`

Un formulaire (`id=new_user`) permet de renseigner :

```javascript
{ 
  user: {
    lastname: '…',
    firstname: '…',
    login: '…',
    password: '…'
  }
}
```
La validation du formulaire engendre l'envoi des données récoltées à `POST
/people`

### `GET /people/:id`
### `GET /people/:id/edit`

### `POST /people`

À partir du formulaire créé dans `GET /people/new`, on essaye de créer un nouvel
utilisateur. Si cela réussit, on redirige vers l'affichage de la liste, sinon on 
réaffiche le formulaire, éventuellement avec les données déjà rentrées,
éventuellement en signalant la raison de l'erreur.


### `DELETE /people/:id`

### `PATCH /people/:id`


## Le modèle

Par l'étude de la vue de création, on définit le modèle comme devant comporter
les champs `lastname`, `firstname`, `login` et `password`.
On compte se servir du champ `login` comme identifiant unique dans les URL, il
faut donc s'assurer que 2 utilisateurs ne peuvent pas avoir le même.

## Création du projet

npm init pour créer le fichier `package.json`

## Installation de casperjs

Nous utilisons [CasperJS](http://casperjs.org/) pour décrire les scénarios
d'utilisation de notre application, ce qui permet d'écrire en meme temps des
test d'intégration.

## Premier scénario : création d'utilisateur

voir le [fichier](./test/integration/user_creation.js)

Pour écrire ce scénario, nous avons fixé les éléments HTML manipulés durant le
scénario, en particulier :

* le lien permettant de demander le formulaire de création
* l'identifiant du formulaire

L'idée est de permettre de repérer l'élément, pas de forcer sa description
complète. On utilise donc de préférence plutôt des ids, des classes css ou des éléments
de texte que des tag HTML.
