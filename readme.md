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

CasperJS dépend de phantomJS, un navigateur headless. Il faut installer les 2
exécutables au niveau système, par exemple avec:

    sudo npm install -g phantomjs casperjs

## Premier scénario : création d'utilisateur

voir le [fichier](./test/integration/user_creation.js)

Pour écrire ce scénario, nous avons fixé les éléments HTML manipulés durant le
scénario, en particulier :

* le lien permettant de demander le formulaire de création
* l'identifiant du formulaire

L'idée est de permettre de repérer l'élément, pas de forcer sa description
complète. On utilise donc de préférence plutôt des ids, des classes css ou des éléments
de texte que des tag HTML.

L'écriture du test d'intégration implique que l'on dispose à chaque étape :
* des URLs manipulés
* des éléments HTML manipulés dans le navigateur Phantomjs par CasperJS lors du déroulement du
scénario

Ce qui veut dire que l'on a déjà spécifié l'application, ce qui est décrit pour
les vues concernées dans la première partie.

## Tester la partie API de l'application

Pour tester la partie API de l'application, nous allons utiliser [Supertest](https://github.com/visionmedia/supertest).

Un des avantages est que l'on pourra utiliser l'API pour gérer facilement des utilisateurs pour les tests d'intégration écrits avec CasperJS.

voir [test/integration/user_creation_api.js](./test/integration/user_creation_api.js)

## Express: comment gérer 2 formats: json/html ?

Rappel: le client HTTP fixe les types de contenu acceptable dans l'entête `Accept`.

Pour s'adapter au type de contenu voulu par le client, il suffit donc d'exploiter cet entête.

Express.js livre plusieurs procédés plus faciles à utiliser que l'exploitation brute de l'entête.

Par ordre de sophistication :

1. [`req.accepted`](http://expressjs.com/api.html#req.accepted) renvoie un
tableau des types acceptés par le client, ordonné par préférence.  
2. [`req.accepts('type')`](http://expressjs.com/api.html#req.accepts) vérifie que
le type passé en argument est acceptable par le client.
3. [`res.formtat(object)`](http://expressjs.com/api.html#res.format) permet de
spécifier une fonction callback à appeler pour gérer un type:

```javascript
res.format({
  'text/plain': function(){
    res.send('hey');
  },
  
  'text/html': function(){
    res.send('hey');
  },
  
  'application/json': function(){
    res.send({ message: 'hey' });
  }
});
```


