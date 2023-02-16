const { SlashCommandBuilder } = require("@discordjs/builders")
const { PermissionFlagsBits } = require('discord-api-types/v10')
const { MessageEmbed, MessageAttachment } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Átugorja a most játszó videót")
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
    async execute(interaction, client) {
        const queue = client.player.getQueue(interaction.guild)

        if (!queue) return await interaction.reply("A lejátszási-lista üres")

        const song = queue.current
        if(1 > queue.tracks.length) return interaction.reply('Nincs több videó a lejátszási-listán')

        queue.skip()

        const img = new MessageAttachment('./assets/music/skip.png', 'img.png')

        const embed = new MessageEmbed()
        .setTitle('/skip')
        .setDescription(`**${song.title}** átugorva. Most játszik: **${queue.tracks[0].title}**` + '\n------------------------------------------------')
        .setThumbnail('attachment://img.png')
        .setColor('BLURPLE')
        .setFooter({ text: 'Lobby Hungary | Zene', iconURL: interaction.guild.iconURL() })

        await interaction.reply({ embeds: [embed], files: [img] })
    },
}