const { SlashCommandBuilder } = require('@discordjs/builders')
const { PermissionFlagsBits } = require('discord-api-types/v10')
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('Jelentsd be a szabályszegőket')
        .addUserOption((option) => option.setName('target').setDescription('A felhasználó akit fel akarsz jelenteni').setRequired(true))
        .addStringOption((option) => option.setName('reason').setDescription('Az ok amiért fel akarsz jelenteni valakit').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
    async execute(interaction, client) {
        const target = interaction.options.getUser('target')
        const reason = interaction.options.getString('reason')
        const user = interaction.user
        const modChannel = interaction.guild.channels.cache.get('1036714511127814164')

        if(target.id === interaction.guild.ownerId) return interaction.reply({ content: 'Majd holnap!', ephemeral: true})
        if(target.id === user.id) return interaction.reply({ content: 'Nem tudod magadat feljelenteni!', ephemeral: true})

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
            .setDescription(`${user}! Biztos vagy benne, hogy feljelented ${target} felhasználót?`)
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
            .setTitle(`${target.tag} ki lett tiltva!`)
            .addFields(
                { name: 'Felhasználó:', value: `${target}` },
                { name: 'Feljelentő:', value: `${user}` },
                { name: 'Jelentés Oka:', value: `${reason}` }
            )
            .setFooter({ text: 'Lobby Hungary | Büntetésvégrehajtás', iconURL: interaction.guild.iconURL() })

            await modChannel.send({ embeds: [modlogEmbed], components: [], fetchReply: true });
            interaction.editReply({ content: `${target} sikeresen bejelentve!`, embeds: [] , components: [], ephemeral: true })
        }

        function cancel () {
            interaction.editReply({ content: 'A feljelentés elengedve!', components: [], embeds: [], ephemeral: true });
        }
    }
}