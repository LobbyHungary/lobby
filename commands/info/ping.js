const { SlashCommandBuilder } = require('@discordjs/builders')
const { PermissionFlagsBits } = require('discord-api-types/v10')
const { MessageEmbed } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Elküldi a bot ping-jét')
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true,
            ephemeral: true
        })

        const embed = new MessageEmbed()
        .setTitle('Discord Ping')
        .setDescription('A Discord bot pingjei az alábbi listában olvashatók:')
        .addFields(
            { name: '**API Késés:**', value: `*${client.ws.ping}ms*` },
            { name: '**Kliens Ping:**', value: `*${message.createdTimestamp - interaction.createdTimestamp}ms*` },
        )
        .setFooter({ text: 'Lobby Hungary | Ping', iconURL: interaction.guild.iconURL() })

        await interaction.editReply({
            embeds: [embed]
        })
    }
}