const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  token: process.env.DISCORD_TOKEN,
  spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
  spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  soundcloudClientId: process.env.SOUNDCLOUD_CLIENT_ID,
  soundcloudClientSecret: process.env.SOUNDCLOUD_CLIENT_SECRET,
  mongodbUri: process.env.MONGODB_URI,
  postgresUri: process.env.POSTGRES_URI,
};