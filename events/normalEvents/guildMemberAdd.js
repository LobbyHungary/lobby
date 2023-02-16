const { Permissions, MessageAttachment, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const { CaptchaGenerator } = require('captcha-canvas')

module.exports = {
    name: "guildMemberAdd",
    async execute(guildMember) {

        const betaRole = guildMember.guild.roles.cache.find(r => r.name === 'Béta')
        const userRole = guildMember.guild.roles.cache.find(r => r.name === 'Tag')
        const tempRole = guildMember.guild.roles.cache.find(r => r.name === 'Hitelesítés Alatt')
        const rulesChannel = guildMember.guild.channels.cache.find(c => c.name === 'szabályok')

        guildMember.roles.add(tempRole)

        const verifyChannel = await guildMember.guild.channels.create(`${guildMember.user.tag}`, {
            type: "GUILD_TEXT",
            parent: "1034168265511022612",
            permissionOverwrites: [
                { id: guildMember.id, allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.READ_MESSAGE_HISTORY] },
                { id: guildMember.guild.id, deny: [Permissions.FLAGS.VIEW_CHANNEL] }
            ],
        })

        const captcha = new CaptchaGenerator()
            .setDimension(150, 400)
            .setTrace()
            .setDecoy()
        const buffer = captcha.generateSync()

        const attachment = new MessageAttachment(buffer, 'captcha.png')

        const embed = new MessageEmbed()
            .setImage('attachment://captcha.png')
            .setTitle('Biztonsági Ellenőrzés')
            .setDescription(`Oldd meg a captcha-t. **A válaszodat a ${verifyChannel} csatornára írd le**! A captcha megoldására 2 perced van.`)
            .setColor("GREEN")

        const code = captcha.text.toLowerCase()

        verifyChannel.send({ embeds: [embed], files: [attachment] })

        const filter = m => m.content.toLowerCase().includes(`${code}`);
        const collector = verifyChannel.createMessageCollector({ filter, time: 120000 });

        collector.on('collect', m => {
            if (m.content.toLowerCase() === code) {
                const targetEmbed = new MessageEmbed()
                    .setColor("GREEN")
                    .setTitle(`Sikeres Hitelesítés`)
                    .setDescription(`Kedves ${guildMember.user.username}!\n`
                        + `Köszöntünk a ${guildMember.guild.name} szerveren! Érezd jól magadat és jó játékot! Mielőtt viszont nekiállnál valaminek kérlek olvasd el a ${rulesChannel} szobát!`
                    )
                    .setThumbnail('https://i.imgur.com/72vAleA.png')
                    .setFooter({ text: 'Lobby Hungary | Hitelesítés', iconURL: guildMember.guild.iconURL() })

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
    
                guildMember.guild.channels.cache.find(c => c.name === '👋》üdvözlő').send(`${welcomeMessages[index]}`)

                guildMember.roles.add(userRole)
                guildMember.roles.add(betaRole)
                guildMember.roles.remove(tempRole)

                collector.stop()
            }
        });

        collector.on('end', collected => {
            verifyChannel.delete()

            if (collected.size < 1) {
                const linkRow = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setLabel('Lobby Hungary Support')
                            .setURL('https://discord.com/users/947851581481680918')
                            .setStyle('LINK')
                    )
                const targetEmbed = new MessageEmbed()
                    .setColor("RED")
                    .setTitle(`Sikertelen Hitelesítés`)
                    .setDescription(`Kedves ${guildMember.user.username}!\n`
                        + `Sajnálattal értesítünk, hogy a hitelesítésed sikertelen kérlek próbáld meg újra. Ha nem működik a hitelesítés kérlek fordulj a Supporthoz!`
                    )
                    .setThumbnail('https://i.imgur.com/OFsxE5Q.png')
                    .setFooter({ text: 'Lobby Hungary | Hitelesítés', iconURL: guildMember.guild.iconURL() })

                guildMember.send({ embeds: [targetEmbed], components: [linkRow] }).catch(error => {
                    return
                })
            }
        })
    }
}