const { SlashCommandBuilder } = require('discord.js');
const { token } = require('../../utils/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips the current song'),
  async execute(interaction) {
    const queue = interaction.client.queue.get(interaction.guild.id);
    if (!queue) {
      return interaction.reply({
        content: 'There is no song currently playing!',
        ephemeral: true,
      });
    }

    queue.player.stop();
    await interaction.reply('Skipped the current song!');
  },
};