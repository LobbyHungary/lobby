const { SlashCommandBuilder } = require('@discordjs/builders')
const { PermissionFlagsBits } = require('discord-api-types/v10')
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
const ms = require('ms')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Felfüggeszt embereket a szerveren')
        .addUserOption((option) => option.setName('target').setDescription('A felhasználó akit fel akarsz függeszteni').setRequired(true))
        .addIntegerOption((option) => option.setName('number').setDescription('Egy szám 1 és 60 között').setRequired(true).setMinValue(1).setMaxValue(60))
        .addStringOption((option) => option.setName('type').setDescription('Az idő típusa (perc, óra, nap, stb.)').setRequired(true).setChoices(
            { name: 'perc', value: 'm' },
            { name: 'óra', value: 'h' },
            { name: 'nap', value: 'd' },
            { name: 'hét', value: 'w' },
        ))
        .addStringOption((option) => option.setName('reason').setDescription('Az ok amiért fel akarsz függeszteni valakit').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction, client) {
        const target = interaction.options.getUser('target')
        const reason = interaction.options.getString('reason')
        const user = interaction.user
        const modChannel = interaction.guild.channels.cache.get('1036714511127814164')

        const targetMember = interaction.guild.members.cache.get(target.id)
        const userMember = interaction.guild.members.cache.get(user.id)

        if (target.id === interaction.guild.ownerId) return interaction.reply({ content: 'Majd holnap!', ephemeral: true })
        if (target.id === user.id) return interaction.reply({ content: 'Nem tudod magadat felfüggeszteni!', ephemeral: true })
        if (targetMember.roles.highest.position >= userMember.roles.highest.position) return interaction.reply({ content: 'A felhasználónak magasabb vagy veled egyenlő rangja van!', ephemeral: true })

        const timeoutTime = ms(`${interaction.options.getInteger('number')}${interaction.options.getString('type')}`)

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
            .setDescription(`${user}! Biztos vagy benne, hogy felfüggeszted ${target} felhasználót?`)
            .setFooter({ text: 'Lobby Hungary | Büntetésvégrehajtás', iconURL: interaction.guild.iconURL() })
            .setThumbnail(user.avatarURL())
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

        async function confirm() {

            // Server Log

            const modlogEmbed = new MessageEmbed()
                .setColor('BLURPLE')
                .setTitle(`${target.tag} fel lett függesztve!`)
                .addFields(
                    { name: 'Felhasználó:', value: `${target}` },
                    { name: 'Moderátor:', value: `${user}` },
                    { name: 'Felfüggesztés Oka:', value: `${reason}` },
                    { name: 'Felfüggesztési-idő:', value: `${interaction.options.getInteger('number')}${interaction.options.getString('type')}` }
                )
                .setFooter({ text: 'Lobby Hungary | Büntetésvégrehajtás', iconURL: interaction.guild.iconURL() })

            await modChannel.send({ embeds: [modlogEmbed], components: [], fetchReply: true });
            interaction.editReply({ content: `${target} sikeresen felfüggesztve!`, embeds: [] , components: [], ephemeral: true })

            // User Log

            const linkRow = new MessageActionRow()
            .addComponents(
                    new MessageButton()
                    .setLabel('Lobby Hungary Support')
                    .setURL('https://discord.com/users/947851581481680918')
                    .setStyle('LINK')
            )

            const targetEmbed = new MessageEmbed()
                .setColor('BLURPLE')
                .setTitle(`Fel lettél függesztve!`)
                .setDescription(`Kedves ${target}!\n`
                    + `Sajnálattal értesítünk, hogy fel lettél függesztve a ${interaction.guild.name} szerveren! További szabályszegések komolyabb büntetéseket is vanhatnak maguk után!`
                )
                .addFields(
                    { name: 'Moderátor:', value: `${user}` },
                    { name: 'Felfüggesztés Oka:', value: `${reason}` },
                    { name: 'Felfüggesztési-idő:', value: `${interaction.options.getInteger('number')}${interaction.options.getString('type')}` }
                )
                .setFooter({ text: 'Lobby Hungary | Büntetésvégrehajtás', iconURL: interaction.guild.iconURL() })


            await target.send({ embeds: [targetEmbed] }).catch(async error => { 
                const errorEmbed = new MessageEmbed()
                .setDescription(`Nem sikerült üzenetet küldeni ${target} felhasználónak!`)
                .setColor('RED')

                const errorMessage = await interaction.channel.send({ embeds: [errorEmbed], components: [linkRow] })
                setTimeout(() => {
                    errorMessage.delete()
                }, 10000);
             })

            targetMember.timeout(timeoutTime, `${reason}`)

            setTimeout(() => {
                try {
                    const untimeoutedEmbed = new MessageEmbed()
                        .setDescription(`${target} felfüggesztése lejárt!`)
                        .setColor('BLURPLE')

                    interaction.editReply({ embeds: [untimeoutedEmbed] })
                } catch (error) {
                    throw error;
                }
            }, timeoutTime);

        }

        function cancel() {
            interaction.editReply({ content: 'A felfüggesztés elengedve!', components: [], embeds: [], ephemeral: true });
        }
    }
}