const TempChannels = require("discord-temp-channels");

module.exports = {
    name: "voiceStateUpdate",
    async execute(client) {
        const tempChannels = new TempChannels(client);

        tempChannels.registerChannel("1035563118853632100", {
            childCategory: "1041342108017111070",
            childAutoDeleteIfEmpty: true,
            childAutoDeleteIfOwnerLeaves: false,
            childFormat: (member) => `${member.user.username} szobája`
        });

        tempChannels.registerChannel("1035561096934871160", {
            childCategory: "1041342108017111070",
            childMaxUsers: 2,
            childAutoDeleteIfEmpty: true,
            childAutoDeleteIfOwnerLeaves: false,
            childFormat: (member) => `${member.user.username} szobája`
        });

        tempChannels.registerChannel("1035561394902417462", {
            childCategory: "1041342108017111070",
            childMaxUsers: 3,
            childAutoDeleteIfEmpty: true,
            childAutoDeleteIfOwnerLeaves: false,
            childFormat: (member) => `${member.user.username} szobája`
        });

        tempChannels.registerChannel("1035561545427587182", {
            childCategory: "1041342108017111070",
            childMaxUsers: 4,
            childAutoDeleteIfEmpty: true,
            childAutoDeleteIfOwnerLeaves: false,
            childFormat: (member) => `${member.user.username} szobája`
        });

        tempChannels.registerChannel("1035561721835835422", {
            childCategory: "1041342108017111070",
            childMaxUsers: 5,
            childAutoDeleteIfEmpty: true,
            childAutoDeleteIfOwnerLeaves: false,
            childFormat: (member) => `${member.user.username} szobája`
        });

        tempChannels.registerChannel("1035561967756255252", {
            childCategory: "1041342108017111070",
            childMaxUsers: 8,
            childAutoDeleteIfEmpty: true,
            childAutoDeleteIfOwnerLeaves: false,
            childFormat: (member) => `${member.user.username} szobája`
        });

        tempChannels.registerChannel("1035562077202423818", {
            childCategory: "1041342108017111070",
            childMaxUsers: 10,
            childAutoDeleteIfEmpty: true,
            childAutoDeleteIfOwnerLeaves: false,
            childFormat: (member) => `${member.user.username} szobája`
        });

        tempChannels.registerChannel("1035562376419872778", {
            childCategory: "1041342108017111070",
            childMaxUsers: 12,
            childAutoDeleteIfEmpty: true,
            childAutoDeleteIfOwnerLeaves: false,
            childFormat: (member) => `${member.user.username} szobája`
        });

        tempChannels.registerChannel("1035562490517540935", {
            childCategory: "1041342108017111070",
            childMaxUsers: 16,
            childAutoDeleteIfEmpty: true,
            childAutoDeleteIfOwnerLeaves: false,
            childFormat: (member) => `${member.user.username} szobája`
        });

        tempChannels.registerChannel("1035562647564849253", {
            childCategory: "1041342108017111070",
            childMaxUsers: 24,
            childAutoDeleteIfEmpty: true,
            childAutoDeleteIfOwnerLeaves: false,
            childFormat: (member) => `${member.user.username} szobája`
        });

        tempChannels.registerChannel("1036715018546327592", {
            childCategory: "1041342108017111070",
            childMaxUsers: 0,
            childAutoDeleteIfEmpty: true,
            childAutoDeleteIfOwnerLeaves: false,
            childFormat: (member) => `⛔ MOD`
        });

        tempChannels.registerChannel("1036715125543010364", {
            childCategory: "1041342108017111070",
            childMaxUsers: 0,
            childAutoDeleteIfEmpty: true,
            childAutoDeleteIfOwnerLeaves: false,
            childFormat: (member) => `⛔ ADMIN`
        });

        tempChannels.on("childCreate", (member) => {
            const tempRole = member.guild.roles.cache.find(r => r.name === 'Ideiglenes Csatorna')

            const verification = member.guild.roles.cache.find(r => r.name === 'Hitelesítés Alatt')
            const moderator = member.guild.roles.cache.find(r => r.name === 'Moderátor')
            const administrator = member.guild.roles.cache.find(r => r.name === 'Adminisztrátor')

            try {
                setTimeout(() => {
                    member.roles.add(tempRole)
                }, 1000)
            } catch (err) {
                console.log(err)
                throw err
            }

            setTimeout(() => {
                if (member.voice.channel.name === '⛔ MOD') {
                    const channel = member.voice.channel
                    channel.permissionOverwrites.set([
                        { id: moderator.id, allow: ["CONNECT"] },
                        { id: member.guild.id, deny: ["CONNECT"] }
                    ])
                } else if (member.voice.channel.name === '⛔ ADMIN') {
                    const channel = member.voice.channel
                    channel.permissionOverwrites.set([
                        { id: administrator.id, allow: ["CONNECT"] },
                        { id: member.guild.id, deny: ["CONNECT"] }
                    ])
                }

                const normalChannel = member.voice.channel
                    normalChannel.permissionOverwrites.set([
                        { id: verification.id, deny: ["VIEW_CHANNEL"] }
                    ])
            }, 1000)
        });
    }
}