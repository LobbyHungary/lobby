const { SlashCommandBuilder } = require('@discordjs/builders')
const { PermissionFlagsBits } = require('discord-api-types/v10')
const { MessageEmbed } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('open')
    .setDescription('Nyitóbuli')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
  async execute(interaction, client) {
    var rawDate = new Date()

    var countDownDate = rawDate.setHours(rawDate.getHours() + 1)

    let embed = new MessageEmbed()
      .setDescription('-')

    interaction.reply({ content: 'Az időzítő el lett indítva!' })
    const message = await interaction.channel.send({ embeds: [embed], fetchReply: true })

    var x = setInterval(async function () {

      var now = new Date().getTime();

      var distance = countDownDate - now;

      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (days < 10) {
        var days = `0${days}`
      }
      if (hours < 10) {
        var hours = `0${hours}`
      }
      if (minutes < 10) {
        var minutes = `0${minutes}`
      }
      if (seconds < 10) {
        var seconds = `0${seconds}`
      }

      let embed1 = new MessageEmbed()
        .setDescription(`${days} : ${hours} : ${minutes} : ${seconds}`)

      await message.edit({ embeds: [embed1] })

      if (distance < 1) {
        clearInterval(x);
        let embed2 = new MessageEmbed()
          .setDescription(`Lejárt az idő`)

        await message.edit({ embeds: [embed2] })
      }
    }, 1000);
  }
}