const { SlashCommandBuilder } = require("@discordjs/builders")
const { PermissionFlagsBits } = require('discord-api-types/v10')
const { MessageEmbed, MessageAttachment } = require("discord.js")
const interactionCreate = require("../../events/commandEvents/interactionCreate")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("cards")
        .setDescription("Kártyák")
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
    async execute(interaction, client) {

        // Joker

        const isJoker = Math.floor(Math.random() * 53)
        const joker = new MessageAttachment(`./assets/card/joker.png`, 'joker.png')
        const jokerEmbed = new MessageEmbed()
            .setTitle(`Kártyajáték`)
            .setDescription(`A(z) ${interaction.user} által húzott kártya: Joker\n\n` +`*Minden kártyára ugyanannyi az esély, hogy kihúzd (1/53)*`)
            .setColor("BLURPLE")
            .setImage('attachment://joker.png')
            .setFooter({ text: 'Lobby Hungary | Fun', iconURL: interaction.guild.iconURL() })
        if (isJoker === 0) return interaction.reply({ embeds: [jokerEmbed], files: [joker], ephemeral: true })

        // Not Joker

        const cardValue = Math.floor(Math.random() * 13)
        const typeValue = Math.floor(Math.random() * 4)

        let cardNum = 0
        let cardNumHU = 0
        let cardType = 0
        let cardTypeHU = 0

        if (cardValue < 9) {
            cardNum = cardValue + 2, cardNumHU = cardValue + 2
        } else if (cardValue > 8) {
            if (cardValue === 9) { cardNum = 'j', cardNumHU = 'Jumbó' }
            if (cardValue === 10) { cardNum = 'q', cardNumHU = 'Dáma' }
            if (cardValue === 11) { cardNum = 'k', cardNumHU = 'Király' }
            if (cardValue === 12) { cardNum = 'a', cardNumHU = 'Ász' }
        }

        if (typeValue === 0) { cardType = 'club', cardTypeHU = 'Treff' }
        if (typeValue === 1) { cardType = 'diamond', cardTypeHU = 'Káró' }
        if (typeValue === 2) { cardType = 'spade', cardTypeHU = 'Pikk' }
        if (typeValue === 3) { cardType = 'heart', cardTypeHU = 'Kőr' }

        const cardImage = new MessageAttachment(`./assets/card/${cardType}/${cardNum}.png`, 'cardImg.png')

        let embed = new MessageEmbed()
            .setTitle(`Kártyajáték`)
            .setDescription(`A(z) ${interaction.user} által húzott kártya: ${cardTypeHU} ${cardNumHU}\n\n` +`*Minden kártyára ugyanannyi az esély, hogy kihúzd (1/53)*`)
            .setColor("BLURPLE")
            .setImage('attachment://cardImg.png')
            .setFooter({ text: 'Lobby Hungary | Fun', iconURL: interaction.guild.iconURL() })

        interaction.reply({ embeds: [embed], files: [cardImage], ephemeral: true })
    },
}