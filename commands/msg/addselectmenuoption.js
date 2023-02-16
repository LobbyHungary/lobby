const { SlashCommandBuilder } = require('@discordjs/builders')
const { PermissionFlagsBits } = require('discord-api-types/v10')
const { MessageSelectMenu, MessageActionRow } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addselectmenuoption')
        .setDescription('Adj egy üzenethez egy menü opciót')
        .addRoleOption((option) => option.setName('role').setDescription('A rang amit társítani szeretnél a menühöz').setRequired(true))
        .addChannelOption((option) => option.setName('channel').setDescription('A szöveges szoba amiben az üzenet van').setRequired(true))
        .addStringOption((option) => option.setName('id').setDescription('Az üzenet ID-je').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {
        const role = interaction.options.getRole('role')
        const message = interaction.options.getString('id')
        const channel = interaction.options.getChannel('channel')

        if (channel.type !== 'GUILD_TEXT') return interaction.reply({ content: 'Egy szöveges csatornát válassz!', ephemeral: true })

        const targetMessage = await channel.messages.fetch(message, {
            cache: true,
            force: true
        })

        if(!targetMessage) return interaction.reply({ content: 'Nem létezik ilyen üzenet!', ephemeral: true })

        if(targetMessage.author.id !== client.user.id) return interaction.reply({ content: 'Ezt az üzenetet nem tudom szerkeszteni!', ephemeral: true })

        let row = targetMessage.components[0]
        if (!row) {
            row = new MessageActionRow()
        }

        const option = [{
            label: role.name,
            value: role.id
        }]

        const menu = row.components[0]
        if (menu) {
            for (const o of menu.options) {
                if (o.value === option[0].value) return interaction.reply({
                    content: `${o.value} már része ennek a menünek`,
                    allowedMentions: {
                        roles: []
                    },
                    ephemeral: true
                })
            }

            menu.addOptions(option)
            menu.setMaxValues(menu.options.length)
        } else {
            row.addComponents(
                new MessageSelectMenu()
                .setCustomId('game_role')
                .setPlaceholder('Válaszd ki a kedvenc játékaidat!')
                .setMinValues(0)
                .setMaxValues(1)
                .addOptions(option)
            )
        }

        targetMessage.edit({
            components: [row]
        })

        interaction.reply({
            content: `${role} sikeresen hozzá lett adva a menühöz!`,
            allowedMentions: {
                roles: []
            },
            ephemeral: true
        })
    }
}