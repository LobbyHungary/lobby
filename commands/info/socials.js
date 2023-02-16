const { SlashCommandBuilder } = require('@discordjs/builders')
const { PermissionFlagsBits } = require('discord-api-types/v10')
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('socials')
        .setDescription('Megmutatja az elérhetőségeinket')
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
    async execute(interaction, client) {
        const linkRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Youtube')
                    .setURL('https://youtube.com')
                    .setStyle('LINK'),

                new MessageButton()
                    .setLabel('TikTok')
                    .setURL('https://tiktok.com')
                    .setStyle('LINK'),

                new MessageButton()
                    .setLabel('Twitter')
                    .setURL('https://twitter.com')
                    .setStyle('LINK'),

                new MessageButton()
                    .setLabel('Instagram')
                    .setURL('https://instagram.com')
                    .setStyle('LINK'),

                new MessageButton()
                    .setLabel('Patreon')
                    .setURL('https://patreon.com')
                    .setStyle('LINK')
            )

        const embed = new MessageEmbed()
            .setTitle('Közösségi Média')
            .setDescription('Iratkozz fel, kövess be és csatlakozz a Lobby Hungary közösségi média profiljaihoz, köszönjük a támogadásodat!')
            .setFooter({ text: 'Lobby Hungary | Közösségi Média', iconURL: interaction.guild.iconURL() })

        await interaction.reply({
            embeds: [embed],
            components: [linkRow],
            ephemeral: true
        })
    }
}