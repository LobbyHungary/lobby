const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonStyle, ButtonBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
        data: new SlashCommandBuilder()
                .setName('kick')
                .setDescription('Kidob egy felhasználót a szerverről')
                .addUserOption((option) => option.setName('felhasználó').setDescription('A felhasználó akit ki szeretnél dobni a szerverről').setRequired(true))
                .addStringOption((option) => option.setName('indok').setDescription('A kidobás oka').setRequired(true))
                .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
        async execute(interaction) {
                const target = interaction.options.getUser('felhasználó')
                const reason = interaction.options.getString('indok')
                const author = interaction.user
                const modlog = interaction.guild.channels.cache.get('1077271497921544364')

                const targetMember = interaction.guild.members.cache.get(target.id)
                const authorMember = interaction.guild.members.cache.get(author.id)

                if (target.id === interaction.guild.ownerId) return interaction.reply({ content: `Nem lehet kidobni ${target}-t, mert ő a szerver tulajdonosa`, ephemeral: true })
                if (target.id === author.id) return interaction.reply({ content: 'Nem tudod magadat kidobni ', ephemeral: true })
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
                        .setDescription(`${author}! Biztos vagy benne, hogy kidobod ${target} felhasználót?`)
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
                                .setTitle(`${target.tag} ki lett dobva !`)
                                .addFields([
                                        { name: 'Felhasználó:', value: `${target}` },
                                        { name: 'Moderátor:', value: `${author}` },
                                        { name: 'Kidobás Oka:', value: `${reason}` },
                                ])
                                .setFooter({ text: 'Lobby Hungary | Büntetésvégrehajtás', iconURL: interaction.guild.iconURL() })

                        await modlog.send({ embeds: [modlogEmbed], components: [], fetchReply: true });
                        interaction.editReply({ content: `${target} sikeresen ki lett dobva!`, embeds: [], components: [], ephemeral: true })

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
                                .setTitle(`Kidobás!`)
                                .setDescription(`Kedves ${target}!\n`
                                        + `Sajnálattal értesítünk, hogy ki lettél dobva a ${interaction.guild.name} szerveren! Kérlek legközelebb fektess több figyelmet a szabályzat betartására!`
                                )
                                .addFields([
                                        { name: 'Moderátor:', value: `${author}` },
                                        { name: 'kidobás Oka:', value: `${reason}` },
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

                        setTimeout(() => {
                                try {
                                        targetMember.kick(reason)
                                } catch (error) {
                                        throw error;
                                }
                        }, 1000);
                }

                async function cancel() {
                        interaction.editReply({ content: 'A Kidobás el lett engedve', components: [], embeds: [], ephemeral: true });
                }
        },
};