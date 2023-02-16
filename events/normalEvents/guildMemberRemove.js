module.exports = {
    name: "guildMemberRemove",
    async execute(guildMember) {
        const byeMessages = [
            `Viszlát ${guildMember.user}!`,
            `Csá ${guildMember.user}!`,
            `Remélem még találkozunk ${guildMember.user}!`,
            `Isten veled ${guildMember.user}!`,
            `Sok siker a továbbiakban ${guildMember.user}!`,
            `See ya ${guildMember.user}!`,
            `Várunk vissza ${guildMember.user}!`
        ]

        const index = Math.floor(Math.random() * (byeMessages.length))

        guildMember.guild.channels.cache.find(c => c.name === '👋》távozók').send(`${byeMessages[index]}`)
    }
}