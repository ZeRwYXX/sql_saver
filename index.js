const fs = require('fs');
const config = require('./config.json');
const discord = require('discord.js');
const { WebhookClient, EmbedBuilder } = require('discord.js');
const mysql = require('mysql2/promise');
const path = require('path');

/* 
 * Chargement des dépendances dynamiques
 */
async function loadDependencies() {
  const chalkModule = await import('chalk');
  const gradientModule = await import('gradient-string');
  return { chalk: chalkModule.default, gradient: gradientModule.default };
}

/* 
 * Initialisation du client Discord
 */
const client = new discord.Client({ intents: 32767 });
client.commands = new discord.Collection();

/* 
 * Chargement des événements
 */
const loadEvents = () => {
  const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
  for (const file of events) {
    console.log(`Loading discord.js event ${file}`);
    const event = require(`./events/${file}`);
    client.on(file.split(".")[0], event.bind(null, client));
  }
};

/* 
 * Chargement des commandes
 */
const loadCommands = () => {
  const cmdZeRwYX = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
  for (const file of cmdZeRwYX) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
  }
};

loadEvents();
loadCommands();

console.log(`Slash Commands:`);
console.log(client.commands);

/* 
 * Gestion des erreurs
 */
const webhookClient = new WebhookClient({
  id: config.webhookId,
  token: config.webhookToken
});

process.on('uncaughtException', (error) => {
  console.error('Erreur non capturée :', error);
  sendErrorMessage(error);
});

function sendErrorMessage(error) {
  const errorMessage = `Une erreur s'est produite :\n\`\`\`${error.stack}\`\`\``;
  webhookClient.send(errorMessage)
    .then(() => console.log('Message d\'erreur envoyé avec succès.'))
    .catch((error) => console.error('Erreur lors de l\'envoi du message d\'erreur :', error));
}

try {
  throw new Error('Une erreur s\'est produite !');
} catch (error) {
  sendErrorMessage(error);
}

/* 
 * Exécution du client Discord
 */
client.on('ready', async () => {
  console.log(`Connecté en tant que ${client.user.tag}`);

  try {
    await Promise.all(client.guilds.cache.map(guild => guild.commands.set(client.commands)));
    console.log(`Commandes déployées sur tous les serveurs.`);
  } catch (error) {
    console.error(`Erreur lors du déploiement des commandes : ${error}`);
  }

  if (config.Ascii) {
    const { chalk, gradient } = await loadDependencies();
    await logBanner(chalk, gradient);
    console.log(chalk.green('discord.gg/Fast-RP'));
  } else {
    const { chalk } = await loadDependencies();
    console.log(chalk.green('discord.gg/Fast-RP'));
  }

  // Déclencher la sauvegarde de la base de données au démarrage
  await backupDatabase();

  // Déclencher la sauvegarde de la base de données toutes les 24 heures
  setInterval(backupDatabase, 24 * 60 * 60 * 1000);
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName.toLowerCase());
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
    }
  }
});

/* 
 * Fonction pour afficher la bannière ASCII
 */
async function logBanner(chalk, gradient) {
  const figletModule = await import('figlet');
  const figlet = figletModule.default;
  const bannerText = config.AsciiContent;
 // console.clear();
  figlet(bannerText, (err, data) => {
    if (err) {
      console.error(chalk.red('Erreur lors de la génération de l\'ASCII art'));
      console.dir(err);
      return;
    }
    const gradientAscii = gradient.rainbow(data);
    console.log(gradientAscii);
  });
}
async function backupDatabase() {
  const connection = await mysql.createConnection({
    host: config.sql.host,
    user: config.sql.user,
    password: config.sql.password,
    database: config.sql.database
  });

  const [tables] = await connection.query('SHOW TABLES');
  let backupData = '';

  for (const table of tables) {
    const tableName = table[`Tables_in_s23_rpl`];

    const [createTable] = await connection.query(`SHOW CREATE TABLE \`${tableName}\``);
    let createTableSQL = createTable[0]['Create Table'];

    createTableSQL = createTableSQL
      .replace(/,\s*CONSTRAINT.*?FOREIGN KEY.*?\(.*?\)\s*REFERENCES.*?\(.*?\)/g, '')
      .replace(/,\s*FOREIGN KEY.*?\(.*?\)\s*REFERENCES.*?\(.*?\)/g, '')
      .replace(/,\s*CONSTRAINT.*?CHECK.*?\(.*?\)/g, '') 
      .replace(/ON DELETE CASCADE/g, '') 
      .replace(/ON UPDATE CASCADE/g, '');

    backupData += `${createTableSQL};\n\n`;

    const [rows] = await connection.query(`SELECT * FROM \`${tableName}\``);
    if (rows.length > 0) {
      const columns = Object.keys(rows[0]).map(column => `\`${column}\``).join(', ');

      const values = rows.map(row =>
        `(${Object.values(row).map(value =>
          value === null ? 'NULL' : mysql.escape(value)
        ).join(', ')})`
      ).join(',\n');

      backupData += `INSERT INTO \`${tableName}\` (${columns}) VALUES\n${values};\n\n`;
    }
  }

  const sqlDir = path.join(__dirname, 'SQL');
  if (!fs.existsSync(sqlDir)) {
    fs.mkdirSync(sqlDir, { recursive: true });
  }

  const date = new Date();
  const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
  const formattedDateToEmbed = `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  const fileName = `backup_${formattedDate}.sql`;
  const filePath = path.join(sqlDir, fileName);

  fs.writeFileSync(filePath, backupData);

  const channel = await client.channels.fetch(config.sendSQL);
  const estimationMessage = await channel.send('Estimation du temps d\'envoi du fichier SQL...');

  const embed = new EmbedBuilder()
    .setTitle('Sauvegarde SQL d\'aujourd\'hui')
    .setDescription('Sauvegarde de sécurité de la base de données.')
    .addFields(
      { name: 'Date', value: formattedDateToEmbed, inline: true }, 
      { name: 'Tables', value: tables.length.toString(), inline: true }
    )
    .setColor('#00FF00')
    .setTimestamp();
    await channel.send({
      embeds: [embed]
    });
  
  await channel.send({
    files: [filePath]
  });

  await estimationMessage.delete();

  const files = fs.readdirSync(sqlDir).filter(file => file.endsWith('.sql'));
  if (files.length > 7) {
    const oldestFile = files.sort((a, b) =>
      fs.statSync(path.join(sqlDir, a)).mtime - fs.statSync(path.join(sqlDir, b)).mtime
    )[0];
    fs.unlinkSync(path.join(sqlDir, oldestFile));
  }

  await connection.end();
}

client.login(config.botToken);
