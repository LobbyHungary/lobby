const { SlashCommandBuilder } = require('@discordjs/builders')
const { PermissionFlagsBits } = require('discord-api-types/v10')
const { MessageEmbed } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voice')
        .setDescription('Hangcsatorna beállítások [Csak csatorna-tulajdonosoknak]')
        .addSubcommandGroup((group) => group
            .setName('channel')
            .setDescription('Minden csatornával kapcsolatos parancs')
            .addSubcommand((subCommand) => subCommand
                .setName('name')
                .setDescription('Állítsd be a hangcsatorna nevét!')
                .addStringOption((option => option
                    .setName('channel-name')
                    .setDescription('A csatorna új neve')
                    .setRequired(true)
                    .setMinLength(3)
                    .setMaxLength(22)
                ))
            )
            .addSubcommand((subCommand) => subCommand
                .setName('limit')
                .setDescription('Állítsd be a hangcsatorna felhasználókorlátját')
                .addIntegerOption((option => option
                    .setName('channel-limit')
                    .setDescription('A csatorna új felhasználókorlátja')
                    .setRequired(true)
                    .setMinValue(1)
                    .setMaxValue(99)
                ))
            )
            .addSubcommand((subCommand) => subCommand
                .setName('bitrate')
                .setDescription('Állítsd be a hangcsatorna bitrátáját!')
                .addIntegerOption((option => option
                    .setName('channel-bitrate')
                    .setDescription('A csatorna új bitrátája')
                    .setRequired(true)
                    .setMinValue(8)
                    .setMaxValue(96)
                ))
            )
            .addSubcommand((subCommand) => subCommand
                .setName('lock')
                .setDescription('Zárd le vagy old fel a csatornát')
                .addStringOption((option => option
                    .setName('channel-lock')
                    .setDescription('A csatorna lezárásának ki/be kapcsolása')
                    .setChoices(
                        { name: 'Be', value: 'on' },
                        { name: 'Ki', value: 'off' }
                    )
                    .setRequired(true)
                ))
            )
            .addSubcommand((subCommand) => subCommand
                .setName('transfer')
                .setDescription('Átadja a csatorna tulajdonjogát egy másik felhasználónak')
                .addUserOption((option => option
                    .setName('channel-transfer')
                    .setDescription('A felhasználó akinek át akarod adni a csatornát')
                    .setRequired(true)
                ))
            ))
        .addSubcommandGroup((group) => group
            .setName('user')
            .setDescription('Minden felhasználóval kapcslatos parancs')
            .addSubcommand((subCommand) => subCommand
                .setName('ban')
                .setDescription('Kitilt egy felhasználót a hangcsatornáról')
                .addUserOption((option => option
                    .setName('user-ban')
                    .setDescription('A felhasználó akit ki akarsz tiltani')
                    .setRequired(true)
                ))
            )
            .addSubcommand((subCommand) => subCommand
                .setName('kick')
                .setDescription('Kidob egy felhasználót a hangcsatornáról')
                .addUserOption((option => option
                    .setName('user-kick')
                    .setDescription('A felhasználó akit ki akarsz dobni')
                    .setRequired(true)
                ))
            )
            .addSubcommand((subCommand) => subCommand
                .setName('permit')
                .setDescription('Engedélyt ad egy felhasználőnak a csatlakozásra, ha a csatorna le van zárva')
                .addUserOption((option => option
                    .setName('user-permit')
                    .setDescription('A felhasználó akinek engedélyt akarsz adni')
                    .setRequired(true)
                ))
            ).addSubcommand((subCommand) => subCommand
                .setName('unban')
                .setDescription('Vissza tilt egy felhasználót, ha ki van tiltva')
                .addUserOption((option => option
                    .setName('user-unban')
                    .setDescription('A felhasználó akit vissza akarsz tiltani')
                    .setRequired(true)
                ))
            )
            .addSubcommand((subCommand) => subCommand
                .setName('invite')
                .setDescription('Meghív egy felhasználót a csatornára')
                .addUserOption((option => option
                    .setName('user-invite')
                    .setDescription('A felhasználó akit megakarsz hívni')
                    .setRequired(true)
                ))
                .addStringOption((option => option
                    .setName('message')
                    .setDescription('Egy barátságos üzenet')
                ))
            ))
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
    async execute(interaction, client) {
        const member = interaction.guild.members.cache.get(interaction.user.id)
        const voiceChannel = member.voice.channel

        const nochannelEmbed = new MessageEmbed()
            .setDescription(`Úgy tűnkik jelenleg nem tartózkodsz hangcsatornán!`)
            .setColor('RED')

        if (!voiceChannel) return interaction.reply({ embeds: [nochannelEmbed] })

        const nopermEmbed = new MessageEmbed()
            .setDescription(`Nincs jogod a parancs használatáhot, mert a csatorna nem a tiéd!`)
            .setColor('RED')

        if (!member.roles.cache.has('1030738018266517524')) return interaction.reply({ embeds: [nopermEmbed], allowedMentions: { users: [] }, ephemeral: true })

        // Name Parancs

        if (interaction.options.getSubcommand() === 'name') {
            const string = interaction.options.getString('channel-name')
            interaction.reply({ content: `A csatornád neve mostantól: ${string}`, allowedMentions: { users: [] }, ephemeral: true })
            voiceChannel.setName(string)
        }

        // Limit Parancs

        else if (interaction.options.getSubcommand() === 'limit') {
            const integer = interaction.options.getInteger('channel-limit')
            interaction.reply({ content: `A csatornád felhasználókorlátja mostantól: ${integer}`, allowedMentions: { users: [] }, ephemeral: true })
            voiceChannel.setUserLimit(integer)
        }

        // Bitrate Parancs

        else if (interaction.options.getSubcommand() === 'bitrate') {
            const integer = interaction.options.getInteger('channel-bitrate')
            interaction.reply({ content: `A csatornád bitrátája mostantól: ${integer} kbps`, allowedMentions: { users: [] }, ephemeral: true })
            voiceChannel.setBitrate(integer * 1000)
        }

        // Lock Parancs

        else if (interaction.options.getSubcommand() === 'lock') {
            const string = interaction.options.getString('channel-lock')
            if (string === 'on') {
                voiceChannel.permissionOverwrites.set([
                    { id: interaction.user.id, allow: ["CONNECT"] },
                    { id: interaction.guild.id, deny: ["CONNECT"] }
                ])
                interaction.reply({ content: 'A csatorna mostantól privát', allowedMentions: { users: [] }, ephemeral: true })
            } else if (string === 'off') {
                voiceChannel.permissionOverwrites.set([
                    { id: interaction.user.id, allow: ["CONNECT"] },
                    { id: interaction.guild.id, allow: ["CONNECT"] }
                ])
                interaction.reply({ content: 'A csatorna mostantól nyilvános', allowedMentions: { users: [] }, ephemeral: true })
            }
        }

        // Transfer Parancs

        else if (interaction.options.getSubcommand() === 'transfer') {
            const user = interaction.options.getUser('channel-transfer')
            const target = interaction.guild.members.cache.get(user.id)
            if (!target.voice) return interaction.reply({ content: `${user} nem található egy hangcsatornán sem`, allowedMentions: { users: [] }, ephemeral: true })
            if (member.voice.channelId !== target.voice.channelId) return interaction.reply({ content: `${user} nem a te hangcsatornádon van`, allowedMentions: { users: [] }, ephemeral: true })
            const tempRole = member.guild.roles.cache.find(r => r.name === 'Ideiglenes Csatorna')
            member.roles.remove(tempRole)
            target.roles.add(tempRole)

            interaction.reply({ content: `${user} mostantól csatornatulajdonos`, allowedMentions: { users: [] }, ephemeral: true })
        }

        // Ban Parancs

        else if (interaction.options.getSubcommand() === 'ban') {
            const user = interaction.options.getUser('user-ban')
            const target = interaction.guild.members.cache.get(user.id)
            if (!target.voice) return interaction.reply({ content: `${user} nem található egy hangcsatornán sem`, allowedMentions: { users: [] }, ephemeral: true })
            if (member.voice.channelId !== target.voice.channelId) return interaction.reply({ content: `${user} nem a te hangcsatornádon van`, allowedMentions: { users: [] }, ephemeral: true })
            target.voice.disconnect()
            voiceChannel.permissionOverwrites.set([
                { id: user, deny: ["CONNECT"] }
            ])
            interaction.reply({ content: `${user} ki lett tiltva erről a hangcstornáról`, allowedMentions: { users: [] }, ephemeral: true })
        }

        // Kick Parancs

        else if (interaction.options.getSubcommand() === 'kick') {
            const user = interaction.options.getUser('user-kick')
            const target = interaction.guild.members.cache.get(user.id)
            if (!target.voice) return interaction.reply({ content: `${user} nem található egy hangcsatornán sem`, allowedMentions: { users: [] }, ephemeral: true })
            if (member.voice.channelId !== target.voice.channelId) return interaction.reply({ content: `${user} nem a te hangcsatornádon van`, allowedMentions: { users: [] }, ephemeral: true })
            target.voice.disconnect()
            interaction.reply({ content: `${user} ki lett dobva erről a hangcsatornáról`, allowedMentions: { users: [] }, ephemeral: true })
        }

        // Permit Parancs

        else if (interaction.options.getSubcommand() === 'permit') {
            const user = interaction.options.getUser('user-permit')
            voiceChannel.permissionOverwrites.set([
                { id: user, allow: ["CONNECT"] }
            ])
            interaction.reply({ content: `${user} mostantól tud csatlakozni erre a csatornára`, allowedMentions: { users: [] }, ephemeral: true })
        }

        // Invite Parancs

        else if (interaction.options.getSubcommand() === 'invite') {
            const user = interaction.options.getUser('user-invite')
            let string = interaction.options.getString('message')
            if (!string) {
                string = 'Csatlakozz a hangcsatornámhoz!'
            }
            const targetEmbed = new MessageEmbed()
                .setColor('BLURPLE')
                .setDescription(`${interaction.user} meghívott téged! ${voiceChannel}\n ${string}`)
                .setFooter({ text: 'Lobby Hungary | Hangcsatornák', iconURL: interaction.guild.iconURL() })

            await user.send({ embeds: [targetEmbed], allowedMentions: { users: [] }, ephemeral: true }).catch(async error => {
                const errorEmbed = new MessageEmbed()
                    .setDescription(`Nem sikerült üzenetet küldeni ${user} felhasználónak`)
                    .setColor('RED')

                const errorMessage = await interaction.channel.send({ embeds: [errorEmbed], allowedMentions: { users: [] }, ephemeral: true })
                setTimeout(() => {
                    errorMessage.delete()
                }, 10000);
            })

            interaction.reply({ content: `${user} meg lett hívva a csatornára`, allowedMentions: { users: [] }, ephemeral: true })
        }

        // Unban Parancs

        else if (interaction.options.getSubcommand() === 'unban') {
            const user = interaction.options.getUser('user-unban')
            voiceChannel.permissionOverwrites.set([
                { id: user, allow: ["CONNECT"] }
            ])
            interaction.reply({ content: `${user} vissza lett tiltva`, allowedMentions: { users: [] }, ephemeral: true })
        }
    }
}