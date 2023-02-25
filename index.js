const { Client, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config()
const fs = require('fs')
const mongoose = require('mongoose')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.MessageContent
    ]
});

// Command Handler - ./commands/folder/file - v14

const commandFolders = fs.readdirSync(`./commands`)
const commands = []

client.commands = new Collection()

for (const folder of commandFolders) {
    const commandFiles = fs
        .readdirSync(`./commands/${folder}`)
        .filter((file) => file.endsWith('.js'))
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`)
        commands.push(command.data.toJSON())
        client.commands.set(command.data.name, command)
    }
}

// Event Handler - ./events/folder/file - v14

const eventFolders = fs.readdirSync(`./events`)

for (const folder of eventFolders) {
    const eventFiles = fs
        .readdirSync(`./events/${folder}`)
        .filter((file) => file.endsWith('.js'))
    for (const file of eventFiles) {
        const event = require(`./events/${folder}/${file}`)

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, commands))
        } else {
            client.on(event.name, (...args) => event.execute(...args, commands))
        }
    }
}

const dbFiles = fs
    .readdirSync(`./database/databaseEvents`)
    .filter((file) => file.endsWith('.js'))
for (const file of dbFiles) {
    const dbEvent = require(`./database/databaseEvents/${file}`)

    if (dbEvent.once) {
        mongoose.connection.once(dbEvent.name, (...args) => dbEvent.execute(...args, client))
    } else {
        mongoose.connection.on(dbEvent.name, (...args) => dbEvent.execute(...args, client))
    }
}

(async () => {
    mongoose.set("strictQuery", false)
    await mongoose.connect(process.env.LOBBY_MONGO).catch(console.error)
})()

// Client Login

client.login(process.env.LOBBY_SECRET)