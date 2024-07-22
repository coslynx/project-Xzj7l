const { SlashCommandBuilder } = require('discord.js');
const { token } = require('../../utils/config');
const ytsr = require('ytsr');
const ytdl = require('ytdl-core');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays a song from YouTube')
    .addStringOption((option) =>
      option.setName('song').setDescription('The song to play').setRequired(true)
    ),
  async execute(interaction) {
    const songName = interaction.options.getString('song');

    // Join the voice channel if not already in one
    if (!interaction.member.voice.channel) {
      return interaction.reply({
        content: 'You need to be in a voice channel to play music!',
        ephemeral: true,
      });
    }

    // Get the voice connection for the guild
    const voiceChannel = interaction.member.voice.channel;
    const queue = interaction.client.queue.get(interaction.guild.id);

    // If the queue does not exist, create one
    if (!queue) {
      const connection = interaction.client.queue.get(interaction.guild.id);
      const player = interaction.client.player.get(interaction.guild.id);

      if (!connection) {
        await interaction.reply({
          content: 'Connecting to voice channel...',
          ephemeral: true,
        });
      }

      // Search for the song on YouTube
      try {
        const searchResults = await ytsr(songName);
        const video = searchResults.items[0];

        if (!video) {
          return interaction.reply({
            content: 'No matching song found!',
            ephemeral: true,
          });
        }

        // Add the song to the queue
        const song = {
          title: video.title,
          author: video.author.name,
          url: video.url,
          stream: ytdl(video.url, { filter: 'audioonly' }),
        };

        queue.songs.push(song);

        // Start playing the song if it's the first in the queue
        if (!queue.player.playing) {
          queue.player.play();
        }

        await interaction.reply({
          content: `Added **${song.title}** to the queue!`,
          ephemeral: true,
        });
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: 'There was an error playing the song!',
          ephemeral: true,
        });
      }
    } else {
      // Search for the song on YouTube
      try {
        const searchResults = await ytsr(songName);
        const video = searchResults.items[0];

        if (!video) {
          return interaction.reply({
            content: 'No matching song found!',
            ephemeral: true,
          });
        }

        // Add the song to the queue
        const song = {
          title: video.title,
          author: video.author.name,
          url: video.url,
          stream: ytdl(video.url, { filter: 'audioonly' }),
        };

        queue.songs.push(song);

        await interaction.reply({
          content: `Added **${song.title}** to the queue!`,
          ephemeral: true,
        });
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: 'There was an error playing the song!',
          ephemeral: true,
        });
      }
    }
  },
};