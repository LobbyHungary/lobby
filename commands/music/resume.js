const { SlashCommandBuilder } = require("@discordjs/builders")
const { PermissionFlagsBits } = require('discord-api-types/v10')
const { MessageEmbed, MessageAttachment } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Elindítja a megállított videót")
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
    async execute(interaction, client) {
        const queue = client.player.getQueue(interaction.guild)

        if (!queue) return await interaction.reply("A lejátszási-lista üres")

        queue.setPaused(false)

        const img = new MessageAttachment('./assets/music/resume.png', 'img.png')
        
        const embed = new MessageEmbed()
        .setTitle('/resume')
        .setDescription(`A videó lejátszása újra játszik` + '\n------------------------------------------------')
        .setThumbnail('attachment://img.png')
        .setColor('BLURPLE')
        .setFooter({ text: 'Lobby Hungary | Zene', iconURL: interaction.guild.iconURL() })

        await interaction.reply({ embeds: [embed], files: [img] })
    },
}