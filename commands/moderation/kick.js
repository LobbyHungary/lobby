const { SlashCommandBuilder } = require('@discordjs/builders')
const { PermissionFlagsBits } = require('discord-api-types/v10')
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kidob embereket a szerverről')
        .addUserOption((option) => option.setName('target').setDescription('A felhasználó akit ki szeretnél dobni').setRequired(true))
        .addStringOption((option) => option.setName('reason').setDescription('Az ok amiért ki akarsz dobni valakit!').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction, client) {
        const target = interaction.options.getUser('target')
        const reason = interaction.options.getString('reason')
        const user = interaction.user
        const modChannel = interaction.guild.channels.cache.get('1036714511127814164')

        const targetMember = interaction.guild.members.cache.get(target.id)
        const userMember = interaction.guild.members.cache.get(user.id)

        if(target.id === interaction.guild.ownerId) return interaction.reply({ content: 'Majd holnap!', ephemeral: true})
        if(target.id === user.id) return interaction.reply({ content: 'Nem tudod magadat dobni!', ephemeral: true})
        if(targetMember.roles.highest.position >= userMember.roles.highest.position) return interaction.reply({ content: 'A felhasználónak magasabb vagy veled egyenlő rangja van!', ephemeral: true})

        const confirmationRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('accept')
                    .setLabel('Igen')
                    .setStyle('SUCCESS'),

                new MessageButton()
                    .setCustomId('deny')
                    .setLabel('Nem')
                    .setStyle('DANGER')
            )

        const embed = new MessageEmbed()
            .setTitle('Megerősítés')
            .setDescription(`${user}! Biztos vagy benne, hogy kidobot ${target} felhasználót?`)
            .setThumbnail(user.avatarURL())
            .setFooter({ text: 'Lobby Hungary | Büntetésvégrehajtás', iconURL: interaction.guild.iconURL() })
            .setColor('BLURPLE')

        await interaction.reply({
            embeds: [embed],
            components: [confirmationRow],
            fetchReply: true,
            ephemeral: true
        })

        // Confirmation

        const filter = i => i.customId === 'accept' || 'deny' && i.user.id === `${user.id}`;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 10000 });
        collector.on('collect', async i => {
            if (i.customId === 'accept') return confirm()
            if (i.customId === 'deny') return cancel()
        });

        async function confirm () {

            // Server Log

            const modlogEmbed = new MessageEmbed()
            .setColor('BLURPLE')
            .setTitle(`${target.tag} ki lett dobva!`)
            .addFields(
                { name: 'Felhasználó:', value: `${target}` },
                { name: 'Moderátor:', value: `${user}` },
                { name: 'Kidobás Oka:', value: `${reason}` }
            )
            .setFooter({ text: 'Lobby Hungary | Büntetésvégrehajtás', iconURL: interaction.guild.iconURL() })

            await modChannel.send({ embeds: [modlogEmbed], components: [], fetchReply: true });
            interaction.editReply({ content: `${target} sikeresen kidobva!`, embeds: [] , components: [], ephemeral: true })

            // User Log

            const linkRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Visszacsatlakozás a szerverhez!')
                    .setURL('https://discord.gg/SpHCA522BD')
                    .setStyle('LINK'),

                    new MessageButton()
                    .setLabel('Lobby Hungary Support')
                    .setURL('https://discord.com/users/947851581481680918')
                    .setStyle('LINK')
            )

            const targetEmbed = new MessageEmbed()
            .setColor('BLURPLE')
            .setTitle(`Ki lettél dobva!`)
            .setDescription(`Kedves ${target.username}!\n`
            +`Sajnálattal értesítünk, hogy ki lettél dobva a ${interaction.guild.name} szerverről! További szabályszegések komolyabb büntetéseket is vanhatnak maguk után!`
            )
            .addFields(
                { name: 'Moderátor:', value: `${user}` },
                { name: 'Kidobás Oka:', value: `${reason}` }
            )
            .setFooter({ text: 'Lobby Hungary | Büntetésvégrehajtás', iconURL: interaction.guild.iconURL() })

            await target.send({ embeds: [targetEmbed], components: [linkRow] }).catch(async error => { 
                const errorEmbed = new MessageEmbed()
                .setDescription(`Nem sikerült üzenetet küldeni ${target} felhasználónak!`)
                .setColor('RED')

                const errorMessage = await interaction.channel.send({ embeds: [errorEmbed] })
                setTimeout(() => {
                    errorMessage.delete()
                }, 10000);
             })

            setTimeout(() => {
                try {
                    targetMember.kick(`${reason}`) 
                } catch (error) {
                    throw error;
                }
            }, 1000);

        }

        function cancel () {
            interaction.editReply({ content: 'A kidobás elengedve!', components: [], embeds: [], ephemeral: true });
        }
    }
}