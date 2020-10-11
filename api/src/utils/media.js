const { ffprobe } = require("./bash");
const { getProfilebyIdFromDb } = require("./db");
const path = require("path");

const mediaProcessor = (media) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { profileId, filename } = media;
      const profiles = await getProfilebyIdFromDb(profileId);
      const profile = profiles && profiles.length > 0 ? profiles[0] : null;
      if (
        !(['.mkv', '.mp4', '.mts', '.ts', '.m2ts', '.avi'].includes(path.extname(filename)))
      ) {
        resolve();
        return;
      }
      const streams = ffprobe(filename).streams.map((stream) => {
        const {
          index,
          codec_name,
          codec_long_name,
          codec_type,
          channels,
          channel_layout,
          disposition,
          tags,
        } = stream;
        return {
          index,
          codec_name,
          codec_long_name,
          codec_type,
          channels,
          channel_layout,
          language: tags ? tags.language || "und" : "und",
          default: disposition ? disposition.default || 0 : 0,
        };
      });
      const params = [];

      // Step 1: Check container
      const shouldSwapContainer = !(
        path.extname(filename) === `.${profile.container}`
      );

      // Step 2: Filter streams by wanted languages
      const filteredVideoStreams = streams.filter(
        (stream) => stream.codec_type === "video" && stream.default === 1
      );
      console.assert(filteredVideoStreams.length === 1, 'There should be at least one video stream: ' + filename);

      let filteredAudioStreams = streams.filter(
        (stream) =>
          stream.codec_type === "audio" &&
          profile.language.wanted.includes(stream.language)
      );
      console.assert(filteredAudioStreams.length > 0, 'There should be at least one audio stream: ' + filename);

      let filteredSubtitleStreams = streams.filter(
        (stream) =>
          stream.codec_type === "subtitle" &&
          profile.language.wanted.includes(stream.language)
      );

      if (filteredVideoStreams.length === 1 && filteredAudioStreams.length > 0) {
        
      } else {
        console.log(streams);
        reject(`Could not process: ${filename}`);
        return;
      }

      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  mediaProcessor,
};
