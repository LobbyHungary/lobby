const { SlashCommandBuilder } = require("@discordjs/builders")
const { PermissionFlagsBits } = require('discord-api-types/v10')
const { MessageEmbed, MessageAttachment } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("diceroll")
        .setDescription("Dobókocka dobás")
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
    async execute(interaction, client) {
        const img1 = new MessageAttachment('./assets/diceroll/1.png', 'img1.png')
        const img2 = new MessageAttachment('./assets/diceroll/2.png', 'img2.png')
        const img3 = new MessageAttachment('./assets/diceroll/3.png', 'img3.png')
        const img4 = new MessageAttachment('./assets/diceroll/4.png', 'img4.png')
        const img5 = new MessageAttachment('./assets/diceroll/5.png', 'img5.png')
        const img6 = new MessageAttachment('./assets/diceroll/6.png', 'img6.png')

        const value = Math.floor(Math.random() * 6)

        if (value === 0) {
            const Embed = new MessageEmbed()
                .setTitle('1-es')
                .setDescription(`A(z) ${interaction.user} által indított kockadobás eredménye: 1`)
                .setColor("BLURPLE")
                .setThumbnail('attachment://img1.png')
                .setFooter({ text: 'Lobby Hungary | Fun', iconURL: interaction.guild.iconURL() })

            interaction.reply({ embeds: [Embed], files: [img1] })
        }

        if (value === 1) {
            const Embed = new MessageEmbed()
                .setTitle('2-es')
                .setDescription(`A(z) ${interaction.user} által indított kockadobás eredménye: 2`)
                .setColor("BLURPLE")
                .setThumbnail('attachment://img2.png')
                .setFooter({ text: 'Lobby Hungary | Fun', iconURL: interaction.guild.iconURL() })

            interaction.reply({ embeds: [Embed], files: [img2] })
        }

        if (value === 2) {
            const Embed = new MessageEmbed()
                .setTitle('3-as')
                .setDescription(`A(z) ${interaction.user} által indított kockadobás eredménye: 3`)
                .setColor("BLURPLE")
                .setThumbnail('attachment://img3.png')
                .setFooter({ text: 'Lobby Hungary | Fun', iconURL: interaction.guild.iconURL() })

            interaction.reply({ embeds: [Embed], files: [img3] })
        }

        if (value === 3) {
            const Embed = new MessageEmbed()
                .setTitle('4-es')
                .setDescription(`A(z) ${interaction.user} által indított kockadobás eredménye: 4`)
                .setColor("BLURPLE")
                .setThumbnail('attachment://img4.png')
                .setFooter({ text: 'Lobby Hungary | Fun', iconURL: interaction.guild.iconURL() })

            interaction.reply({ embeds: [Embed], files: [img4] })
        }

        if (value === 4) {
            const Embed = new MessageEmbed()
                .setTitle('5-ös')
                .setDescription(`A(z) ${interaction.user} által indított kockadobás eredménye: 5`)
                .setColor("BLURPLE")
                .setThumbnail('attachment://img5.png')
                .setFooter({ text: 'Lobby Hungary | Fun', iconURL: interaction.guild.iconURL() })

            interaction.reply({ embeds: [Embed], files: [img5] })
        }

        if (value === 5) {
            const Embed = new MessageEmbed()
                .setTitle('6-os')
                .setDescription(`A(z) ${interaction.user} által indított kockadobás eredménye: 6`)
                .setColor("BLURPLE")
                .setThumbnail('attachment://img6.png')
                .setFooter({ text: 'Lobby Hungary | Fun', iconURL: interaction.guild.iconURL() })

            interaction.reply({ embeds: [Embed], files: [img6] })
        }
    },
}