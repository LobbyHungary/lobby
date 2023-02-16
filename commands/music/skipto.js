const { SlashCommandBuilder } = require("@discordjs/builders")
const { PermissionFlagsBits } = require('discord-api-types/v10')
const { MessageEmbed, MessageAttachment } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skipto")
        .setDescription("Áttugor egy adott mennyiségű videót")
        .addIntegerOption((option) => option.setName("number").setDescription("A lejátszási-lista egyik videója").setMinValue(1).setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
    async execute(interaction, client) {
        const queue = client.player.getQueue(interaction.guild)

        if (!queue) return await interaction.reply("A lejátszási-lista üres")

        const trackNumber = interaction.options.getInteger('number')
        if(1 > queue.tracks.length) return interaction.reply('Nincs több videó a lejátszási-listán')
        if(trackNumber > queue.tracks.length) return interaction.reply(`Ez az videó nem létezik. Összesen ${queue.tracks.length} videó van a lejátszási-listában`)

        queue.skipTo(trackNumber - 1)

        const img = new MessageAttachment('./assets/music/skipto.png', 'img.png')

        const embed = new MessageEmbed()
        .setTitle('/skipto')
        .setDescription(`**Átugrottam ${trackNumber} videót**. Most játszik: **${queue.tracks[0].title}**` + '\n------------------------------------------------')
        .setThumbnail('attachment://img.png')
        .setColor('BLURPLE')
        .setFooter({ text: 'Lobby Hungary | Zene', iconURL: interaction.guild.iconURL() })

        await interaction.reply({ embeds: [embed], files: [img] })
    },
}