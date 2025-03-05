# Bot Discord de Sauvegarde SQL

Ce projet est basé sur le bot Discord de ZeRwYXX disponible sur [GitHub](https://github.com/ZeRwYXX/Base-Bot-Slash-ZeRwYX). Nous avons modifié ce bot pour en faire un outil de sauvegarde SQL.

## Prérequis

Avant de lancer le bot, vous devez avoir Node.js installé sur votre machine. Vous pouvez le télécharger et l'installer depuis [Node.js official website](https://nodejs.org/).

## Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/ZeRwYXX/sql_saver
   cd sql_saver
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration**
   Créez un fichier `config.json` dans le répertoire racine du projet avec le contenu suivant :
   ```json
   {
     "botToken": "VOTRE_TOKEN_DE_BOT",
     "webhookId": "ID_DU_WEBHOOK",
     "webhookToken": "TOKEN_DU_WEBHOOK",
     "Ascii": true,
     "AsciiContent": "VOTRE_TEXTE_ASCII",
     "sql": {
       "host": "ADRESSE_DU_SERVEUR_SQL",
       "user": "UTILISATEUR_SQL",
       "password": "MOT_DE_PASSE_SQL",
       "database": "NOM_DE_LA_BASE_DE_DONNÉES"
     }
   }
   ```
   Remplacez les valeurs par vos informations Discord et SQL.

## Utilisation

1. **Lancer le bot**
   ```bash
   node index.js
   ```

   Assurez-vous que le fichier principal de votre bot s'appelle `index.js` ou modifiez la commande ci-dessus pour correspondre au nom de votre fichier.

2. **Sauvegarde SQL**
   - Le bot sauvegardera automatiquement la base de données SQL configurée dans `config.json`.
   - Les fichiers de sauvegarde seront enregistrés dans le répertoire `SQL` du projet.
   - Les sauvegardes seront envoyées dans un canal Discord spécifié dans `config.json`.

## Structure du code

- `index.js`: Point d'entrée principal du bot qui charge les commandes, les événements, et initialise le client Discord.
- `events`: Répertoire contenant les fichiers JavaScript pour les événements Discord.
- `commands`: Répertoire contenant les fichiers JavaScript pour les commandes Discord.
- `SQL`: Répertoire où les fichiers de sauvegarde SQL sont enregistrés.

## Gestion des erreurs

Les erreurs non capturées sont gérées et loggées via un webhook Discord spécifié dans `config.json`. Vous pouvez voir les messages d'erreur directement dans un canal Discord si configuré.

## Sauvegarde SQL

Le bot se connecte à la base de données SQL spécifiée dans `config.json` et crée des fichiers de sauvegarde. Ces fichiers sont ensuite envoyés dans un canal Discord et enregistrés localement dans le répertoire `SQL`.

---

# SQL Backup Discord Bot

This project is based on the Discord bot by ZeRwYXX available on [GitHub](https://github.com/ZeRwYXX/Base-Bot-Slash-ZeRwYX). We have modified this bot to create an SQL backup tool.

## Prerequisites

Before running the bot, you need to have Node.js installed on your machine. You can download and install it from the [Node.js official website](https://nodejs.org/).

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ZeRwYXX/sql_saver
   cd sql_saver
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configuration**
   Create a `config.json` file in the root directory of the project with the following content:
   ```json
   {
     "botToken": "YOUR_BOT_TOKEN",
     "webhookId": "WEBHOOK_ID",
     "webhookToken": "WEBHOOK_TOKEN",
     "Ascii": true,
     "AsciiContent": "YOUR_ASCII_TEXT",
     "sql": {
       "host": "SQL_SERVER_ADDRESS",
       "user": "SQL_USER",
       "password": "SQL_PASSWORD",
       "database": "DATABASE_NAME"
     }
   }
   ```
   Replace the values with your Discord and SQL information.

## Usage

1. **Run the bot**
   ```bash
   node index.js
   ```

   Make sure your bot's main file is named `index.js` or modify the command above to match your file name.

2. **SQL Backup**
   - The bot will automatically back up the SQL database configured in `config.json`.
   - Backup files will be saved in the `SQL` directory of the project.
   - Backups will be sent to a Discord channel specified in `config.json`.

## Code Structure

- `index.js`: Main entry point of the bot that loads commands, events, and initializes the Discord client.
- `events`: Directory containing JavaScript files for Discord events.
- `commands`: Directory containing JavaScript files for Discord commands.
- `SQL`: Directory where SQL backup files are saved.

## Error Handling

Unhandled errors are managed and logged via a Discord webhook specified in `config.json`. You can see error messages directly in a Discord channel if configured.

## SQL Backup

The bot connects to the SQL database specified in `config.json` and creates backup files. These files are then sent to a Discord channel and saved locally in the `SQL` directory.
