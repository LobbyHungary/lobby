const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
require('dotenv').config()

module.exports = {
    name: "ready",
    once: true,
    execute(client, commands) {
        console.log(`${client.user.tag} bejeletkezett és online van! ✅`)


        // Discord Status

        const activities = [
            { type: 'PLAYING', message: 'Discord Mod Game' },
            { type: 'WATCHING', message: 'Discord Üzentek' }
        ];

        setInterval(() => {
            const index = Math.floor(Math.random() * (activities.length));

            client.user.setPresence({
                activities: [{ name: `${activities[index].message}`, type: `${activities[index].type}` }]
            });

        }, 5000);


        // Command registration

        const rest = new REST({ version: '9' }).setToken(process.env.LH_SECRET);

        (async () => {
            try {
                await rest.put(Routes.applicationGuildCommands(process.env.LH_CLIENT, process.env.LH_SERVER),
                    { body: commands });
                console.log('A perjeles (/) parancsok sikeresen regisztrálva lettek')

            } catch (err) {
                if (err) console.log(err)
            }
        })();
    }

}