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

Les URLs permettent de dégager la description du routage de l'application.
(association requête HTTP <-> action d'un contrôleur).

Les vues concernant la création et l'édition d'une ressource permettent de
décrire les modèles qui seront utilisés.

Pour une application permettant de gérer le CRUD d'un modèle, nous obtenons de
manière systématique les vues et le routage suivant :

### `GET /people`

* liste des utilisateurs, sous la forme `nom prénom login`. Pour chaque
utilisateur, des liens permettent de visualiser (GET /people/:id), effacer
(DELET /people/:id), éditer (GET /people/:id/edit) l'utilisateur.  
* un lien/bouton permet de générer `GET /people/new` pour obtenir le formulaire
de création d'un nouvel utilisateur.

### `GET /people/new`

### `GET /people/:id`

### `GET /people/:id/edit`

### `POST /people`

### `DELETE /people/:id`

### `PATCH /people/:id`


## Le modèle

## Création du projet

npm init pour créer le fichier `package.json`

## Installation de casperjs

## Premier scénario : création d'utilisateur

description du scénario en français

description du scénario avec dalek.js


mise en place de dalek.js


