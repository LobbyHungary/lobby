const { SlashCommandBuilder } = require('@discordjs/builders')
const { PermissionFlagsBits } = require('discord-api-types/v10')
const { MessageEmbed } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rules')
        .setDescription('Kilistázza a szerver szabályait')
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
    async execute(interaction, client) {

        const embed = new MessageEmbed()
        .setTitle('Szabályzat')
        .setDescription('Kérlek figyelmesen olvasd át és tartsd be a következő szabályokat:')
        .addFields(
            { name: '**I.	 Szabály**', value: `Ne káromkodj, szitkozódj! Kérlek kerüld az trágár, obszcén kifejezéseket. Fejezd ki magadat a megfelelő módon és tisztelt a többi tagot` },
            { name: '**II.	 Szabály**', value: `Tartsd tisztán a Discord fiókodat! Kérlek ne használj nem ide illő profilképet, leírást vagy akármit, ami sérti a szabályzatunkat` },
            { name: '**III.	 Szabály**', value: `Ne spammelj! Kérlek ne küldj túlzottan sok üzeneteket, képeket, emojikat, különleges karaktereket, parancsokat és @említéseket` },
            { name: '**IV.	 Szabály**', value: `Ne hirdesd magad! Kérlek ne hirdesd se a saját se mások szerverét, közösségi médiáját / közösségét, vagy akármilyen fiókját` },
            { name: '**V.	 Szabály**', value: `Ne ossz meg személyes adatokat! Kérlek a saját érdekedben tartsd titokban a teljes nevedet, iskoládat / munkahelyedet, lakcímedet stb` },
            { name: '**VI.	 Szabály**', value: `Kérlek ne zaklass senkit! Kérlek kerüld a rasszista, szexista, elitista, LMBTQ, fogyatékossággal vagy egyéb megkülönböztető megjegyzéseket` },
            { name: '**VII.	 Szabály**', value: `Ne politizálj! Kérlek tartsd magadban politikai nézetedet és ne ítélj el senkit, mert másmilyen a politikai álláspontja és ezt kérlek tartsd tiszteletben` },
            { name: '**VIII. Szabály**', value: `Ne kalózkodj, avagy ossz meg szexuális / NSFW tartalmat! Ne ossz meg egyébként fizetős tartalmakat vagy szexuális vagy felkavaró tartalmat` },
            { name: '**IX.	 Szabály**', value: `Ne kereskedj. Ezen a szerveren szigorúan tilos kereskedést folytatni. Ezt nagyon szigorúan büntetjük, ugyanis nem szeretnénk elégedetlenséget` },
            { name: '**X.	 Szabály**', value: `A szerver szabályzatát minden tag elfogadta és tudomásul vette a csatlakozás pillanatában és minden esetben betartja azt` },
        )
        .setThumbnail(interaction.guild.iconURL({ format: 'png', size: 4096 }))
        .setColor('ffaa00')
        .setFooter({ text: 'Lobby Hungary | Szabályzat', iconURL: interaction.guild.iconURL() })

        const message = await interaction.reply({
            embeds: [embed],
            fetchReply: true
        })

        message.react('✅')
    }
}