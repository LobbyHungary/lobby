const { SlashCommandBuilder } = require("@discordjs/builders")
const { PermissionFlagsBits } = require('discord-api-types/v10')
const { MessageEmbed, MessageAttachment } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("coinflip")
        .setDescription("Fej vagy írás")
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
    async execute(interaction, client) {
        const img1 = new MessageAttachment('./assets/coinflip/head.png', 'img1.png')
        const img2 = new MessageAttachment('./assets/coinflip/tail.png', 'img2.png')

        const value = Math.floor(Math.random() * 2)

        if (value === 0) {
            const headEmbed = new MessageEmbed()
                .setTitle('Fej')
                .setDescription(`A(z) ${interaction.user} által indított fej vagy írás eredménye: fej`)
                .setColor("BLURPLE")
                .setThumbnail('attachment://img1.png')
                .setFooter({ text: 'Lobby Hungary | Fun', iconURL: interaction.guild.iconURL() })

            interaction.reply({ embeds: [headEmbed], files: [img1] })
        }

        if (value === 1) {
            const tailEmbed = new MessageEmbed()
                .setTitle('Írás')
                .setDescription(`A(z) ${interaction.user} által indított fej vagy írás eredménye: írás`)
                .setColor("BLURPLE")
                .setThumbnail('attachment://img2.png')
                .setFooter({ text: 'Lobby Hungary | Fun', iconURL: interaction.guild.iconURL() })

            interaction.reply({ embeds: [tailEmbed], files: [img2] })
        }
    },
}