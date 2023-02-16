const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed, MessageAttachment } = require("discord.js")
const { PermissionFlagsBits } = require('discord-api-types/v10')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Megmutatja a lejátszási-listát")
    .addIntegerOption((option) => option.setName("page").setDescription("A lejátszási-lista oldala").setMinValue(1))
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),

    async execute(interaction, client) {
        const queue = client.player.getQueue(interaction.guild)
        if (!queue || !queue.playing) return await interaction.reply("A lejátszási-lista üres")

        const totalPages = Math.ceil(queue.tracks.length / 10) || 1
        const page = (interaction.options.getInteger("page") || 1) - 1

        if (page > totalPages) return await interaction.reply(`Ez az oldal nem létezik. Összesen ${totalPages} oldal van a lejátszási-listában`)
        
        const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
            return `**${page * 10 + i + 1}.**  \`[${song.duration}]\` ${song.title} - ${song.requestedBy}`
        }).join("\n")

        const currentSong = queue.current

        const img = new MessageAttachment('./assets/music/queue.png', 'img.png')

        const embed = new MessageEmbed()
        .setDescription(`**Most Játszik:**\n` + (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} - ${currentSong.requestedBy}` : "-") + `\n\n**Lejátszási-lista:**\n${queueString}  + '\n\n------------------------------------------------'`)
        .setFooter({text: `Oldal ${page + 1} / ${totalPages}`})
        .setImage(currentSong.thumbnail)
        .setThumbnail('attachment://img.png')
        .setColor('BLURPLE')
        .setFooter({ text: 'Lobby Hungary | Zene', iconURL: interaction.guild.iconURL() })

        await interaction.reply({
            embeds: [embed], files: [img]
        })
    }
}