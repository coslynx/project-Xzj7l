const ytdl = require('ytdl-core');

class YtdlWrapper {
  /**
   * Downloads and streams YouTube audio.
   *
   * @param {string} url The YouTube video URL.
   * @returns {Promise<ReadableStream>} A promise that resolves with a readable stream of the audio.
   */
  async download(url) {
    try {
      const stream = ytdl(url, { filter: 'audioonly' });
      return stream;
    } catch (error) {
      console.error(`Error downloading YouTube audio: ${error.message}`);
      throw error;
    }
  }
}

module.exports = YtdlWrapper;