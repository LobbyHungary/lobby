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
            .setTitle('Biztons??gi Ellen??rz??s')
            .setDescription(`Oldd meg a captcha-t. **A v??laszodat a ${verifyChannel} csatorn??ra ??rd le**! A captcha megold??s??ra 2 perced van.`)
            .setColor("Green")

        verifyChannel.send({ embeds: [embed], files: [attachment] })

        const key = captcha.text.toLowerCase()

        const filter = m => m.content.toLowerCase().includes(key);
        const collector = verifyChannel.createMessageCollector({ filter, time: 120000 });

        collector.on('collect', m => {
            const targetEmbed = new EmbedBuilder()
                .setTitle(`K??sz??nt??nk ${guildMember.user.username}`)
                .setDescription(`??dv??zl??nk a ${guildMember.guild.name} szerveren. ??rezd j??l magad ??s k??rlek olvasd el a szab??lyokat a ${rulesChannel} csatorn??n.`)
                .setColor('Blurple')
                .setThumbnail('https://i.imgur.com/72vAleA.png')

            guildMember.send({ embeds: [targetEmbed] }).catch(error => {
                return
            })

            const welcomeMessages = [
                `Szia ${guildMember.user}, m??r v??rtunk!`,
                `K??sz??nt??nk a Lobbyban ${guildMember.user}`,
                `Hello ${guildMember.user}!`,
                `Have fun ${guildMember.user}!`,
                `J?? l??tni ${guildMember.user}!`,
                `Cs?? ${guildMember.user}!`,
                `??dv n??lunk ${guildMember.user}!`
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
                    .setTitle(`Sikertelen Hiteles??t??s`)
                    .setDescription('??gy t??nik sikertelen volt a bejelentkez??sed. K??rlek pr??b??ld ??jra az ??zenet alatti gombra kattintva.')
                    .setThumbnail('https://i.imgur.com/OFsxE5Q.png')
                    .setFooter({ text: 'Lobby Hungary | Hiteles??t??s', iconURL: guildMember.guild.iconURL() })

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