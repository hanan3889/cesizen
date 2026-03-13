# CesiZen

> Application web de gestion du stress — auto-diagnostic, suivi des événements de vie et ressources bien-être.

![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

---


## Description

CesiZen est une application web conçue pour aider les utilisateurs à mieux comprendre et gérer leur stress. Elle propose :

- Un **outil d'auto-diagnostic du stress** basé sur les événements de vie marquants
- Un **suivi personnalisé** avec historique des diagnostics
- Des **pages d'information** sur le bien-être et la gestion du stress
- Un **espace d'administration** complet pour piloter le contenu et les utilisateurs

L'application repose sur une API REST Laravel découplée d'une interface React, avec une authentification sécurisée via Laravel Sanctum.

---

## Fonctionnalités

### Utilisateur
- Création de compte et connexion sécurisée
- Réinitialisation de mot de passe par email
- Modification du profil et changement de mot de passe
- Auto-diagnostic de stress (score calculé à partir d'événements de vie)
- Consultation et historique des diagnostics
- Export des données personnelles (RGPD)
- Suppression du compte

### Administrateur
- Tableau de bord d'administration dédié
- **Gestion des utilisateurs** : création, suppression, activation/désactivation de compte, changement de rôle, réinitialisation de mot de passe
- **Gestion des pages** : création, modification, publication, archivage
- **Gestion des catégories** d'information
- **Gestion des événements de vie** (CRUD)
- **Configuration des seuils** de diagnostic de stress


Le frontend communique exclusivement avec le backend via l'API REST prefixée `/api/v1`.

---

## Technologies

| Couche | Technologie | Version |
|--------|-------------|---------|
| Backend | Laravel | `12.x` |
| Authentification | Laravel Sanctum | — |
| Documentation API | Swagger (l5-swagger) | `9.0` |
| Tests backend | PHPUnit | — |
| Frontend | React | `19.x` |
| Langage frontend | TypeScript | — |
| Style | Tailwind CSS | — |
| Composants UI | Radix UI / shadcn | — |
| Tests frontend | Vitest | — |
| Build tool | Vite | — |

---

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **PHP** `^8.2`
- **Composer**
- **Node.js** `^20` & **NPM**

---

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/hanan3889/cesizen.git
cd cesizen
```

### 2. Configurer le backend

```bash
cd backend

# Installer les dépendances PHP
composer install

# Créer le fichier d'environnement
cp .env.example .env

# Générer la clé d'application
php artisan key:generate

# Créer la base de données SQLite et jouer les migrations
touch database/database.sqlite
php artisan migrate
```

### 3. Configurer le frontend

```bash
cd ../frontend

# Installer les dépendances Node
npm install
```

---

## Lancer l'application

Depuis la racine du projet backend, un seul script lance tous les services (serveur Laravel + Vite) :

```bash
cd backend
composer run dev
```

L'application est ensuite accessible à l'adresse affichée par Laravel, par défaut :
**`http://127.0.0.1:8000`**

La documentation Swagger de l'API est disponible à :
**`http://127.0.0.1:8000/api/documentation`**

---

## Auteur

**Hanan REBAÏA** — Promo CDA 25/26, CESI Meylan
