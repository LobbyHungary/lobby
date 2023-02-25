const { REST, Routes } = require('discord.js')
require('dotenv').config()

module.exports = {
    name: "ready",
    once: true,
    execute(client, commands) {
        console.log(`✅ 》${client.user.tag} bejeletkezett és online van`)

        const rest = new REST({ version: '10' }).setToken(process.env.LOBBY_SECRET);

        (async () => {
            try {
                console.log(`🌱 》${commands.length} perjeles (/) parancs betöltése ...`);

                await rest.put(
                    Routes.applicationCommands(process.env.LOBBY_CLIENT, process.env.LOBBY_SERVER),
                    { body: commands },
                );

                console.log(`🌱 》${commands.length} perjeles (/) parancs sikeresen betöltve`);
            } catch (err) {
                if (err) console.log(err)
            }
        })();
    }
}