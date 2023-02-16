const { SlashCommandBuilder } = require("@discordjs/builders")
const { PermissionFlagsBits } = require('discord-api-types/v10')
const { QueueRepeatMode } = require('discord-player')
const { MessageEmbed, MessageAttachment } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Ismételteti a videót")
        .addStringOption((option) => option.setName('type').setDescription('Az ismétlés típusai és ki/be kapcsolása').setRequired(true).setChoices(
            { name: 'most játszó lemez', value: 'track' },
            { name: 'lejátszási-lista', value: 'queue' },
            { name: 'ismétlés kikapcsolása', value: 'off' }
        ))
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
    async execute(interaction, client) {
        const queue = client.player.getQueue(interaction.guild)

        if (!queue) return await interaction.reply("A lejátszási-lista üres")

        const img1 = new MessageAttachment('./assets/music/loop-queue.png', 'img1.png')
        const img2 = new MessageAttachment('./assets/music/loop-track.png', 'img2.png')

        switch (interaction.options._hoistedOptions.map(option => option.value).toString()) {
            case 'track': {
                if (queue.repeatMode === 2) return interaction.reply('🚫 》Már be van kapcsolva az ismétlés. Használd a */loop ismétlés kikapcsolása*, hogy kikapcsold az ismétlést')
                if (queue.repeatMode === 1) return interaction.reply('🚫 》Már be van kapcsolva az ismétlés. Használd a */loop ismétlés kikapcsolása*, hogy kikapcsold az ismétlést')
                const success = queue.setRepeatMode(QueueRepeatMode.TRACK);

                const embed = new MessageEmbed()
                    .setTitle('/loop track')
                    .setDescription(success ? `A lemez ismétlése bekapcsolva` + '\n------------------------------------------------' : `🚫 》Nem működött` + '\n------------------------------------------------')
                    .setThumbnail('attachment://img2.png')
                    .setColor('BLURPLE')
                    .setFooter({ text: 'Lobby Hungary | Zene', iconURL: interaction.guild.iconURL() })

                    return interaction.reply({ embeds: [embed], files: [img2] })

                break
            }
            case 'queue': {
                if (queue.repeatMode === 2) return interaction.reply('🚫 》Már be van kapcsolva az ismétlés. Használd a */loop ismétlés kikapcsolása*, hogy kikapcsold az ismétlést')
                if (queue.repeatMode === 1) return interaction.reply('🚫 》Már be van kapcsolva az ismétlés. Használd a */loop ismétlés kikapcsolása*, hogy kikapcsold az ismétlést')
                const success = queue.setRepeatMode(QueueRepeatMode.QUEUE);

                const embed = new MessageEmbed()
                    .setTitle('/loop queue')
                    .setDescription(success ? `A lejátszási-lista ismétlése bekapcsolva` + '\n------------------------------------------------' : `🚫 》Nem működött` + '\n------------------------------------------------')
                    .setThumbnail('attachment://img1.png')
                    .setColor('BLURPLE')
                    .setFooter({ text: 'Lobby Hungary | Zene', iconURL: interaction.guild.iconURL() })

                    return interaction.reply({ embeds: [embed], files: [img1] })

                break
            }
            case 'off': {
                const success = queue.setRepeatMode(QueueRepeatMode.OFF);

                const embed = new MessageEmbed()
                    .setTitle('/loop off')
                    .setDescription(success ? `Az ismétlés kikapcsolva` + '\n------------------------------------------------' : `🚫 》Már ki van kapcsolva az ismétlés` + '\n------------------------------------------------')
                    .setThumbnail('attachment://img1.png')
                    .setColor('BLURPLE')
                    .setFooter({ text: 'Lobby Hungary | Zene', iconURL: interaction.guild.iconURL() })

                    return interaction.reply({ embeds: [embed], files: [img1] })

                break
            }
        }
    },
}