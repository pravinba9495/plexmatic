const { ffprobe } = require("./bash");
const { getProfilebyIdFromDb } = require("./db");
const path = require("path");

const mediaProcessor = (media) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { profileId, filename } = media;
      const profiles = await getProfilebyIdFromDb(profileId);
      const profile = profiles && profiles.length > 0 ? profiles[0] : null;
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
          language: tags.language || "und",
          default: disposition ? disposition.default : 0,
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
      console.log(filteredVideoStreams);
      let filteredAudioStreams = streams.filter(
        (stream) =>
          stream.codec_type === "audio" &&
          profile.language.wanted.includes(stream.language)
      );
      if (filteredAudioStreams.length === 0) {
        filteredAudioStreams = streams.filter(
          (stream) => stream.codec_type === "audio"
        );
      }
      console.log(filteredAudioStreams);

      let filteredSubtitleStreams = streams.filter(
        (stream) =>
          stream.codec_type === "subtitle" &&
          profile.language.wanted.includes(stream.language)
      );
      if (filteredSubtitleStreams.length === 0) {
        filteredSubtitleStreams = streams.filter(
          (stream) => stream.codec_type === "subtitle"
        );
      }
      console.log(filteredSubtitleStreams);

      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  mediaProcessor,
};
