module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        // Command Handler

        if (interaction.isCommand()) {
            const client = interaction.client

            const command = client.commands.get(interaction.commandName)

            if (!command) return

            try {
                await command.execute(interaction, client);
            } catch (err) {
                console.log(err)
                interaction.reply({
                    content: "Egy hiba lépett fel a parancs futtatása közben",
                    ephemeral: true
                })
            }
        }

        // Select Menu Handler

        else if (interaction.isSelectMenu()) {

            const { customId, values, member } = interaction

            // Select Menus

            if (customId === 'game_role') {
                const component = interaction.component
                const removed = component.options.filter((option) => {
                    return !values.includes(option.value)
                })

                for ( const id of removed) {
                    member.roles.remove(id.value)
                }

                for ( const id of values) {
                    member.roles.add(id)
                }

                interaction.reply({
                    content: `Rangok frissítve!`,
                    ephemeral: true
                })
            }
        }
    }
}