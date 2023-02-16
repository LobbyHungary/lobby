const { SlashCommandBuilder } = require("@discordjs/builders")
const { PermissionFlagsBits } = require('discord-api-types/v10')
const { MessageEmbed, MessageAttachment } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("earrape")
        .setDescription("Nem szeretnéd kipróbálni")
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
    async execute(interaction, client) {
        const queue = client.player.getQueue(interaction.guild)

        if (!queue) return await interaction.reply("A lejátszási-lista üres")

        queue.setFilters({
            earrape: !queue.getFiltersEnabled().includes('earrape'),
            normalizer2: !queue.getFiltersEnabled().includes('earrape')
        });

        const img = new MessageAttachment('./assets/music/earrape.png', 'img.png')

        const embed = new MessageEmbed()
            .setTitle('/earrape')
            .setDescription(`Earrape ${queue.getFiltersEnabled().includes('earrape') ? 'bekapcsolva' : 'kikapcsolva'}!` + '\n------------------------------------------------')
            .setColor("BLURPLE")
            .setThumbnail('attachment://img.png')
            .setFooter({ text: 'Lobby Hungary | Zene', iconURL: interaction.guild.iconURL() })

        await interaction.reply({ embeds: [embed], files: [img] })

    },
}