const { SlashCommandBuilder } = require("@discordjs/builders")
const { PermissionFlagsBits } = require('discord-api-types/v10')
const { MessageEmbed, MessageAttachment } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Leállitja a lejátszási-listát")
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
    async execute(interaction, client) {
        const queue = client.player.getQueue(interaction.guild)

        if (!queue) return await interaction.reply("A lejátszási-lista üres")

        queue.destroy()

        const img = new MessageAttachment('./assets/music/leave.png', 'img.png')

        const embed = new MessageEmbed()
        .setTitle('/leave')
        .setDescription(`Kiléptem a hangcsatornáról` + '\n------------------------------------------------')
        .setThumbnail('attachment://img.png')
        .setColor('BLURPLE')
        .setFooter({ text: 'Lobby Hungary | Zene', iconURL: interaction.guild.iconURL() })

        await interaction.reply({ embeds: [embed], files: [img] })
    },
}