const { SlashCommandBuilder } = require('@discordjs/builders')
const { PermissionFlagsBits } = require('discord-api-types/v10')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Üzenteteket töröl egy csatornáról')
        .addIntegerOption((option) => option.setName('number').setDescription('Egy szám 1 és 100 között').setRequired(true).setMinValue(1).setMaxValue(100))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction, client) {
        try {
            interaction.channel.bulkDelete(interaction.options.getInteger('number'));
            interaction.reply({ content: `Sikeresen töröltünk ${interaction.options.getInteger('number')} üzenetet!`, ephemeral: true })
        } catch (err) {
            interaction.reply({ content: 'Sajnos nem tudsz 2 hétnél idősebb üzenteteket törölni', ephemeral: true })
            throw err;
        }
    }
}