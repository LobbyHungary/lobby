const { SlashCommandBuilder } = require('@discordjs/builders')
const { PermissionFlagsBits } = require('discord-api-types/v10')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sudo')
        .setDescription('Beszélj valaki más nevében')
        .addUserOption((option) => option.setName('target').setDescription('A felhasználó akinek a nevében szeretnél beszélni').setRequired(true))
        .addStringOption((option) => option.setName('message').setDescription('Az üzentet amit a felhasználó akinek a nevében szeretnél beszélni').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {
        const user = interaction.options.getUser('target')
        const message = interaction.options.getString('message')

        const webhook = await interaction.channel.createWebhook(user.username, {
            avatar: user.displayAvatarURL(),
            channel: interaction.channel.id
        });

        interaction.reply({ content: `Új sudo létrehozva!`, ephemeral: true })

        await webhook.send({ content: message }).then(() => {
            webhook.delete();
        });
    }
}