const { SlashCommandBuilder } = require('@discordjs/builders')
const { PermissionFlagsBits } = require('discord-api-types/v10')
const { MessageEmbed, MessageAttachment } = require('discord.js')
const { QueryType } = require('discord-player')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Lejátszik egy YouTube videót')
        .addSubcommand((subcommand) => subcommand
            .setName('url')
            .setDescription('Lejátszik egy videót egy URL-ből')
            .addStringOption((option) => option.setName('url').setDescription('A videó URL címe').setRequired(true))
        )
        .addSubcommand((subcommand) => subcommand
            .setName('search')
            .setDescription('Keress egy videót a megadott kulcsszavakból')
            .addStringOption((option) => option.setName('search').setDescription('A videó címe / kulcsszavai').setRequired(true))
        )
        .addSubcommand((subcommand) => subcommand
            .setName('playlist')
            .setDescription('Lejátszik egy egész lejátszási-listát egy URL-ből')
            .addStringOption((option) => option.setName('playlist').setDescription('A lejátszási-lista URL-je').setRequired(true))
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
    async execute(interaction, client) {
        if (!interaction.member.voice.channel) return interaction.reply('Úgy tűnkik jelenleg nem tartózkodsz hangcsatornán!')

        const img = new MessageAttachment('./assets/music/play.png', 'img.png')

        const queue = await client.player.createQueue(interaction.guild)
        if (!queue.connection) await queue.connect(interaction.member.voice.channel)

        if (interaction.options.getSubcommand() === 'url') {
            let url = interaction.options.getString('url')
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })
            if (result.tracks.length === 0) return interaction.reply('Nincs találat')

            const song = result.tracks[0]
            await queue.addTrack(song)

            let embed = new MessageEmbed()
                .setTitle(`${song.title}`)
                .setURL(song.url)
                .setDescription(`**${song.title}** hozzá lett adva a lejátszási listához`)
                .setImage(song.thumbnail)
                .setThumbnail('attachment://img.png')
                .setFooter({ text: `Videó hossza: ${song.duration} // Lobby Hungary | Zene`, iconURL: interaction.guild.iconURL() })
                .setColor("BLURPLE")

            interaction.reply({ embeds: [embed], files: [img] })

        } else if (interaction.options.getSubcommand() === 'search') {
            let url = interaction.options.getString('search')
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_SEARCH
            })
            if (result.tracks.length === 0) return interaction.reply('Nincs találat')

            const song = result.tracks[0]
            await queue.addTrack(song)

            let embed = new MessageEmbed()
                .setTitle(`${song.title}`)
                .setURL(song.url)
                .setDescription(`**${song.title}** hozzá lett adva a lejátszási listához`)
                .setImage(song.thumbnail)
                .setThumbnail('attachment://img.png')
                .setFooter({ text: `Videó hossza: ${song.duration} // Lobby Hungary | Zene`, iconURL: interaction.guild.iconURL() })
                .setColor("BLURPLE")

            interaction.reply({ embeds: [embed], files: [img] })

        } else if (interaction.options.getSubcommand() === 'playlist') {
            let url = interaction.options.getString('playlist')
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })
            if (result.tracks.length === 0) return interaction.reply('Nincs találat')

            const playlist = result.playlist
            await queue.addTracks(result.tracks)

            let embed = new MessageEmbed()
                .setTitle(`${playlist.title}`)
                .setURL(playlist.url)
                .setDescription(`**${playlist.title}** hozzá lett adva a lejátszási listához`)
                .setImage(playlist.thumbnail.url)
                .setThumbnail('attachment://img.png')
                .setFooter({ text: `Videók száma: ${playlist.tracks.length} // Lobby Hungary | Zene`, iconURL: interaction.guild.iconURL() })
                .setColor("BLURPLE")

            interaction.reply({ embeds: [embed], files: [img] })
        }
        if (!queue.playing) await queue.play()
    }
}