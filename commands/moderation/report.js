const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonStyle, ButtonBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('Bejlent egy felhasználót az moderátoroknak')
        .addUserOption((option) => option.setName('felhasználó').setDescription('A felhasználó akit be szeretnél jelenteni').setRequired(true))
        .addStringOption((option) => option.setName('indok').setDescription('A bejelentés oka').setRequired(true).setMinLength(25).setMaxLength(200))
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
    async execute(interaction) {
        const target = interaction.options.getUser('felhasználó')
        const reason = interaction.options.getString('indok')
        const author = interaction.user
        const modlog = interaction.guild.channels.cache.get('1077271535401844887')

        const targetMember = interaction.guild.members.cache.get(target.id)
        const authorMember = interaction.guild.members.cache.get(author.id)

        if (target.id === interaction.guild.ownerId) return interaction.reply({ content: `Nem lehet bejelenteni ${target}-t, mert ő a szerver tulajdonosa`, ephemeral: true })
        if (target.id === author.id) return interaction.reply({ content: 'Nem tudod magadat bejelenteni ', ephemeral: true })
        if (targetMember.roles.highest.position >= authorMember.roles.highest.position) return interaction.reply({ content: `${target} felhasználónak magasabb vagy veled egyenlő szintű ranja van`, ephemeral: true })

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
            .setDescription(`${author}! Biztos vagy benne, hogy bejelented ${target} felhasználót?`)
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
                .setTitle(`Új bejelentés`)
                .addFields([
                    { name: 'Felhasználó:', value: `${target}` },
                    { name: 'Bejelentő:', value: `${author}` },
                    { name: 'Bejelnetés Oka:', value: `${reason}` },
                ])
                .setFooter({ text: 'Lobby Hungary | Büntetésvégrehajtás', iconURL: interaction.guild.iconURL() })

            await modlog.send({ embeds: [modlogEmbed], components: [], fetchReply: true });
            interaction.editReply({ content: `${target} sikeresen be lett jelentve!`, embeds: [], components: [], ephemeral: true })
        }

        async function cancel() {
            interaction.editReply({ content: 'A bejelentés el lett engedve', components: [], embeds: [], ephemeral: true });
        }
    },
};
