# Cesizen 🧘

🚧 Projet en cours de développemnt.🚧

## Description
Cesizen est une application web conçue pour aider les utilisateurs à mieux comprendre et gérer leur stress. Elle offre des outils d'auto-diagnostic, permet de suivre les événements de vie marquants et propose des pages d'information sur le bien-être.

Développée avec une API backend sous Laravel et une interface interactive en React, l'application fournit une expérience utilisateur sécurisée et personnelle.

## 💾 Technologies

- ![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white) - Version `12.0`
- ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) - Version `19.2.1`
- ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black) - Version `9.0` (via l5-swagger)

## ⚙️ Fonctionnalités
- Consultation d'information
- Création de compte
- Auto-diagnostic et sauvegarde de celui-ci

## 🚀 Mode d'emploi en local

Suivez ces étapes pour cloner et lancer le projet sur votre machine locale.

### Prérequis

Avant de commencer, assurez-vous d'avoir installé les outils suivants :
-   PHP (`^8.2` ou plus récent)
-   Composer
-   Node.js & NPM

### 1. Cloner le Dépôt

```bash
git clone https://github.com/hanan3889/cesizen.git
cd cesizen
```

### 2. Installation

Le projet inclut des scripts pour simplifier l'installation et le lancement.

```bash

composer install

npm install

cp .env.example .env
php artisan key:generate


touch database/database.sqlite
php artisan migrate
```

### 3. Lancer l'Application

Le projet est fourni avec un script qui lance tous les services nécessaires (serveur web, vite, etc.) en une seule commande :

```bash
composer run dev
```

Une fois la commande lancée, votre application sera accessible à l'adresse indiquée par le serveur Laravel (généralement `http://127.0.0.1:8000`).


## 👩‍🎓 Auteur 
Hanan REBAÏA - Promo CDA 25/26 CESI Meylan

