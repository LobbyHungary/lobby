const { SlashCommandBuilder } = require('@discordjs/builders')
const { PermissionFlagsBits } = require('discord-api-types/v10')
const { MessageEmbed } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sendmessage')
        .setDescription('Üzenetet ír')
        .addChannelOption((option) => option.setName('channel').setDescription('A csatorna amiben az üzenetet szeretnéd küldeni').setRequired(true))
        .addStringOption((option) => option.setName('message').setDescription('Az üzenet tartalma').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {
        const channel = interaction.options.getChannel('channel')
        const message = interaction.options.getString('message')
        if(channel.type !== 'GUILD_TEXT') return interaction.reply({content: 'Egy szöveges csatornát válassz!', ephemeral: true })

        channel.send({
            content: `${message}`
        })

        interaction.reply({
            content: 'Kész!',
            ephemeral: true
        })
    }
}