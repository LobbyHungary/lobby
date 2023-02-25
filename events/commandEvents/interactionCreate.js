module.exports = {
    name: "interactionCreate",
    async execute(interaction) {

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
    }
}