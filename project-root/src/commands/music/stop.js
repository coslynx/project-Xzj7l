const { SlashCommandBuilder } = require('discord.js');
const { token } = require('../../utils/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stops the music playback and clears the queue'),
  async execute(interaction) {
    const queue = interaction.client.queue.get(interaction.guild.id);
    if (!queue) {
      return interaction.reply({
        content: 'There is no song currently playing!',
        ephemeral: true,
      });
    }

    queue.player.stop();
    queue.songs = [];
    interaction.client.queue.delete(interaction.guild.id);
    await interaction.reply('Stopped the music and cleared the queue!');
  },
};