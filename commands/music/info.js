const { SlashCommandBuilder } = require("@discordjs/builders")
const { PermissionFlagsBits } = require('discord-api-types/v10')
const { MessageEmbed, MessageAttachment } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Információ a most játszó videóról")
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
    async execute(interaction, client) {
        const queue = client.player.getQueue(interaction.guild)

        if (!queue) return await interaction.reply("A lejátszási-lista üres")

        let bar = queue.createProgressBar({
            queue: false,
            length: 45,
            indicator: 'o',
            line: '-'
        })

        const song = queue.current

        const img = new MessageAttachment('./assets/music/info.png', 'img.png')

        const embed = new MessageEmbed()
            .setThumbnail('attachment://img.png')
            .setImage(song.thumbnail)
            .setDescription(`Most játszik: **${song.title}**\n\n` + `**${bar}**` + '\n\n------------------------------------------------')
            .setFooter({ text: `Videó hossza: ${song.duration} // Lobby Hungary | Zene`, iconURL: interaction.guild.iconURL() })
            .setColor("BLURPLE")
            .setFooter({ text: 'Lobby Hungary | Zene', iconURL: interaction.guild.iconURL() })

        await interaction.reply({
            embeds: [embed], files: [img]
        })
    },
}