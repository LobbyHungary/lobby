const { PermissionFlagsBits, AttachmentBuilder, EmbedBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { CaptchaGenerator } = require('captcha-canvas')

module.exports = {
    name: "guildMemberAdd",
    async execute(guildMember) {
        const betaRole = guildMember.guild.roles.cache.get('1077617054884048937')
        const userRole = guildMember.guild.roles.cache.get('1077341547193974794')
        const tempRole = guildMember.guild.roles.cache.get('1077342026191867934')
        const welcome = guildMember.guild.channels.cache.get('1077338806832861395')
        const rulesChannel = guildMember.guild.channels.cache.get('1077337967586181191')

        guildMember.roles.add(tempRole)

        const verifyChannel = await guildMember.guild.channels.create({
            name: `${guildMember.user.username}`,
            type: ChannelType.GuildText,
            parent: "1077618736447623188",
            permissionOverwrites: [
                { id: guildMember.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
                { id: guildMember.guild.id, deny: [PermissionFlagsBits.ViewChannel] }
            ],
        })

        function makeid(length) {
            let result = '';
            const characters = 'ABCDEFGHIJKLMNOPRSTUVWXYZ123456789';
            const charactersLength = characters.length;
            let counter = 0;
            while (counter < length) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
                counter += 1;
            }
            return result;
        }

        const codex = makeid(6)

        const captcha = new CaptchaGenerator()
            .setCaptcha({ text: `${codex}`, size: 60 })
            .setDimension(150, 400)
            .setTrace()
            .setDecoy()
        const buffer = captcha.generateSync()

        const attachment = new AttachmentBuilder(buffer, { name: 'captcha.png' })

        const embed = new EmbedBuilder()
            .setImage('attachment://captcha.png')
            .setTitle('Biztonsági Ellenőrzés')
            .setDescription(`Oldd meg a captcha-t. **A válaszodat a ${verifyChannel} csatornára írd le**! A captcha megoldására 2 perced van.`)
            .setColor("Green")

        verifyChannel.send({ embeds: [embed], files: [attachment] })

        const key = captcha.text.toLowerCase()

        const filter = m => m.content.toLowerCase().includes(key);
        const collector = verifyChannel.createMessageCollector({ filter, time: 120000 });

        collector.on('collect', m => {
            const targetEmbed = new EmbedBuilder()
                .setTitle(`Köszöntünk ${guildMember.user.username}`)
                .setDescription(`Üdvözlünk a ${guildMember.guild.name} szerveren. Érezd jól magad és kérlek olvasd el a szabályokat a ${rulesChannel} csatornán.`)
                .setColor('Blurple')
                .setThumbnail('https://i.imgur.com/72vAleA.png')

            guildMember.send({ embeds: [targetEmbed] }).catch(error => {
                return
            })

            const welcomeMessages = [
                `Szia ${guildMember.user}, már vártunk!`,
                `Köszöntünk a Lobbyban ${guildMember.user}`,
                `Hello ${guildMember.user}!`,
                `Have fun ${guildMember.user}!`,
                `Jó látni ${guildMember.user}!`,
                `Cső ${guildMember.user}!`,
                `Üdv nálunk ${guildMember.user}!`
            ]

            const index = Math.floor(Math.random() * (welcomeMessages.length))

            welcome.send(`${welcomeMessages[index]}`)

            guildMember.roles.add(userRole)
            guildMember.roles.add(betaRole)
            guildMember.roles.remove(tempRole)

            collector.stop()
        });

        collector.on('end', collected => {
            verifyChannel.delete()

            if (collected.size < 1) {
                const linkRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel('Lobby Hungary Support')
                            .setURL('https://discord.com/users/947851581481680918')
                            .setStyle(ButtonStyle.Link),
                        new ButtonBuilder()
                            .setLabel('Vissza a szerverre')
                            .setURL('https://discord.gg/MJc58cKDn9')
                            .setStyle(ButtonStyle.Link)
                    )
                const targetEmbed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle(`Sikertelen Hitelesítés`)
                    .setDescription('Úgy tűnik sikertelen volt a bejelentkezésed. Kérlek próbáld újra az üzenet alatti gombra kattintva.')
                    .setThumbnail('https://i.imgur.com/OFsxE5Q.png')
                    .setFooter({ text: 'Lobby Hungary | Hitelesítés', iconURL: guildMember.guild.iconURL() })

                guildMember.send({ embeds: [targetEmbed], components: [linkRow] }).catch(error => {
                    return
                })

                setTimeout(() => {
                    try {
                        guildMember.kick()
                    } catch (error) {
                        throw error;
                    }
                }, 1000);
            }
        });
    }
}