const { SlashCommandBuilder } = require('discord.js');
const { token } = require('../utils/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows all available commands'),
  async execute(interaction) {
    const commands = [
      {
        name: 'play',
        description: 'Plays a song from YouTube',
      },
      {
        name: 'skip',
        description: 'Skips the current song',
      },
      {
        name: 'stop',
        description: 'Stops the music playback and clears the queue',
      },
      {
        name: 'queue',
        description: 'Shows the current queue of songs',
      },
      {
        name: 'nowplaying',
        description: 'Shows information about the currently playing song',
      },
      {
        name: 'loop',
        description: 'Toggles the loop mode for the current song or the entire queue',
      },
      {
        name: 'clearqueue',
        description: 'Clears the queue of songs (admin only)',
      },
      {
        name: 'leave',
        description: 'Disconnects the bot from the voice channel (admin only)',
      },
    ];

    let helpMessage = 'Here are the available commands:\n';
    commands.forEach((command) => {
      helpMessage += `**${command.name}**: ${command.description}\n`;
    });

    await interaction.reply(helpMessage);
  },
};