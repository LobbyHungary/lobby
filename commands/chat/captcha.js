const { SlashCommandBuilder } = require('@discordjs/builders')
const { PermissionFlagsBits } = require('discord-api-types/v10')
const { MessageEmbed, MessageAttachment } = require('discord.js')
const { CaptchaGenerator } = require('captcha-canvas')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('captcha')
        .setDescription('Készít egy hitelesítő képet')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {

        function makeid() {
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < 10; i++)possible.charAt(Math.floor(Math.random() * possible.length));
        }

        const captchaText = makeid()

        const captcha = new CaptchaGenerator()
        .setDimension(150, 400)
        .setTrace()
        .setDecoy({opacity: 0.5})
        .setCaptcha({text: captchaText})
        const buffer = captcha.generateSync()

        const attachment = new MessageAttachment(buffer, 'captcha.png')

        const embed = new MessageEmbed()
        .setImage('attachment://captcha.png')
        .setTitle('Captcha')
        .setDescription('Captcha leírás')
        .setColor("GREEN")

        interaction.reply({embeds: [embed], files: [attachment]})
    }
}