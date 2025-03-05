const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Affiche la latence du bot et de l\'API Discord',
    async execute(interaction) {
        const botLatency = Date.now() - interaction.createdTimestamp;

        const embed = new EmbedBuilder()
            .setColor("#ff0000") 
            .setTitle('Latences')
            .addFields(
                { name: 'Latence', value: `${botLatency}ms`, inline: true },
                { name: 'API Latence', value: `${Math.round(interaction.client.ws.ping)}ms`, inline: true }
            )
            .setTimestamp()

        await interaction.reply({ embeds: [embed] });
    },
};
