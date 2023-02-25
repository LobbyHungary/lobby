const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonStyle, ButtonBuilder, EmbedBuilder } = require('discord.js')
const ms = require('ms')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Felfüggeszt egy felhasználót a szerveren')
        .addUserOption((option) => option.setName('felhasználó').setDescription('A felhasználó akit fel szeretnél függeszteni a szerveren').setRequired(true))
        .addStringOption((option) => option.setName('indok').setDescription('A felfüggesztés oka').setRequired(true))
        .addIntegerOption((option) => option.setName('mennyiség').setDescription('Egy szám 1 és 60 között').setRequired(true).setMinValue(1).setMaxValue(60))
        .addStringOption((option) => option.setName('mértékegység').setDescription('Az idő típusa (perc, óra, nap, stb.)').setRequired(true).setChoices(
            { name: 'perc', value: 'm' },
            { name: 'óra', value: 'h' },
            { name: 'nap', value: 'd' },
            { name: 'hét', value: 'w' },
        ))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
        const target = interaction.options.getUser('felhasználó')
        const reason = interaction.options.getString('indok')
        const author = interaction.user
        const modlog = interaction.guild.channels.cache.get('1077271497921544364')
        const number = interaction.options.getInteger('mennyiség')
        const type = interaction.options.getString('mértékegység')

        const targetMember = interaction.guild.members.cache.get(target.id)
        const authorMember = interaction.guild.members.cache.get(author.id)

        if (target.id === interaction.guild.ownerId) return interaction.reply({ content: `Nem lehet felfügeszteni ${target}-t, mert ő a szerver tulajdonosa`, ephemeral: true })
        if (target.id === author.id) return interaction.reply({ content: 'Nem tudod magadat felfüggeszteni', ephemeral: true })
        if (targetMember.roles.highest.position >= authorMember.roles.highest.position) return interaction.reply({ content: `${target} felhasználónak magasabb vagy veled egyenlő szintű ranja van`, ephemeral: true })

        const timeoutTime = ms(`${number}${type}`)

        const confirmationRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('accept')
                    .setLabel('Igen')
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId('deny')
                    .setLabel('Nem')
                    .setStyle(ButtonStyle.Danger)
            )

        const embed = new EmbedBuilder()
            .setTitle('Megerősítés')
            .setDescription(`${author}! Biztos vagy benne, hogy felfüggeszted ${target} felhasználót?`)
            .setFooter({ text: 'Lobby Hungary | Büntetésvégrehajtás', iconURL: interaction.guild.iconURL() })
            .setThumbnail(target.avatarURL())
            .setColor('Blurple')

        await interaction.reply({
            embeds: [embed],
            components: [confirmationRow],
            fetchReply: true,
            ephemeral: true
        })

        const filter = i => i.customId === 'accept' || 'deny' && i.user.id === `${author.id}`;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 10000 });
        collector.on('collect', async i => {
            if (i.customId === 'accept') return confirm()
            if (i.customId === 'deny') return cancel()
        });

        async function confirm() {

            const modlogEmbed = new EmbedBuilder()
                .setColor('Blurple')
                .setTitle(`${target.tag} fel lett függesztve!`)
                .addFields([
                    { name: 'Felhasználó:', value: `${target}` },
                    { name: 'Moderátor:', value: `${author}` },
                    { name: 'Felfüggesztés Oka:', value: `${reason}` },
                    { name: 'Felfüggesztési-idő:', value: `${interaction.options.getInteger('mennyiség')}${interaction.options.getString('mértékegység')}` }
                ])
                .setFooter({ text: 'Lobby Hungary | Büntetésvégrehajtás', iconURL: interaction.guild.iconURL() })

            await modlog.send({ embeds: [modlogEmbed], components: [], fetchReply: true });
            interaction.editReply({ content: `${target} sikeresen felfüggesztve!`, embeds: [], components: [], ephemeral: true })

            // User Log

            const linkRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('Lobby Hungary Support')
                        .setURL('https://discord.com/users/947851581481680918')
                        .setStyle(ButtonStyle.Link)
                )

            const targetEmbed = new EmbedBuilder()
                .setColor('Blurple')
                .setTitle(`Fel lettél függesztve!`)
                .setDescription(`Kedves ${target}!\n`
                    + `Sajnálattal értesítünk, hogy fel lettél függesztve a ${interaction.guild.name} szerveren! További szabályszegések komolyabb büntetéseket is vanhatnak maguk után!`
                )
                .addFields([
                    { name: 'Moderátor:', value: `${author}` },
                    { name: 'Felfüggesztés Oka:', value: `${reason}` },
                    { name: 'Felfüggesztési-idő:', value: `${interaction.options.getInteger('mennyiség')}${interaction.options.getString('mértékegység')}` }
                ])
                .setFooter({ text: 'Lobby Hungary | Büntetésvégrehajtás', iconURL: interaction.guild.iconURL() })


            await target.send({ embeds: [targetEmbed], components: [linkRow] }).catch(async error => {
                const errorEmbed = new EmbedBuilder()
                    .setDescription(`Nem sikerült üzenetet küldeni ${target} felhasználónak!`)
                    .setColor('Red')

                const errorMessage = await interaction.channel.send({ embeds: [errorEmbed] })
                setTimeout(() => {
                    errorMessage.delete()
                }, 10000);
            })

            targetMember.timeout(timeoutTime, `${reason}`)

            setTimeout(() => {
                try {
                    const untimeoutedEmbed = new EmbedBuilder()
                        .setDescription(`${target} felfüggesztése lejárt!`)
                        .setColor('Blurple')

                    interaction.editReply({ embeds: [untimeoutedEmbed] })
                } catch (error) {
                    throw error;
                }
            }, timeoutTime);
        }

        async function cancel() {
            interaction.editReply({ content: 'A felfüggesztés el lett engedve', components: [], embeds: [], ephemeral: true });
        }
    },
};