const { SlashCommandBuilder } = require('discord.js');
const { token } = require('../../utils/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Shows information about the currently playing song'),
  async execute(interaction) {
    const queue = interaction.client.queue.get(interaction.guild.id);
    if (!queue) {
      return interaction.reply({
        content: 'There is no song currently playing!',
        ephemeral: true,
      });
    }

    const song = queue.songs[0];
    const songInfo = `Now playing: **${song.title}** by **${song.author}**`;
    await interaction.reply(songInfo);
  },
};