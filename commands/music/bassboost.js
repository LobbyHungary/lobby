const { SlashCommandBuilder } = require("@discordjs/builders")
const { PermissionFlagsBits } = require('discord-api-types/v10')
const { MessageEmbed, MessageAttachment } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bassboost")
        .setDescription("BA DUMTSD...")
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
    async execute(interaction, client) {
        const queue = client.player.getQueue(interaction.guild)

        if (!queue) return await interaction.reply("A lejátszási-lista üres")

        queue.setFilters({
            bassboost_high: !queue.getFiltersEnabled().includes('bassboost_high'),
            normalizer2: !queue.getFiltersEnabled().includes('bassboost_high')
        });

        const img = new MessageAttachment('./assets/music/bassboost.png', 'img.png')

        const embed = new MessageEmbed()
        .setTitle('/bassboost')
        .setDescription(`Bassboost ${queue.getFiltersEnabled().includes('bassboost_high') ? 'bekapcsolva' : 'kikapcsolva'}!` + '\n------------------------------------------------')
        .setColor("BLURPLE")
        .setThumbnail('attachment://img.png')
        .setFooter({ text: 'Lobby Hungary | Zene', iconURL: interaction.guild.iconURL() })

        await interaction.reply({ embeds: [embed], files: [img] })
    },
}