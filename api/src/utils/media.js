const { ffprobe, ffmpeg } = require("./bash");
const { getProfilebyIdFromDb } = require("./db");
const path = require("path");

const mediaProcessor = (media) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { profileId, filename } = media;
      const profiles = await getProfilebyIdFromDb(profileId);
      const profile = profiles && profiles.length > 0 ? profiles[0] : null;
      if (
        ![".mkv", ".mp4", ".mts", ".ts", ".m2ts", ".avi"].includes(
          path.extname(filename)
        )
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

      const params = {
        input: [],
        output: []
      };

      // Step 1: Filter streams by wanted languages
      const filteredVideoStreams = streams.filter(
        (stream) => stream.codec_type === "video"
      );
      console.assert(
        filteredVideoStreams.length === 1,
        "There should be at least one video stream: " + filename
      );

      let filteredAudioStreams = streams.filter(
        (stream) =>
          stream.codec_type === "audio" &&
          profile.language.wanted.includes(stream.language)
      );
      console.assert(
        filteredAudioStreams.length > 0,
        "There should be at least one audio stream: " + filename
      );

      let filteredSubtitleStreams = streams.filter(
        (stream) => stream.codec_type === "subtitle"
      );

      if (filteredVideoStreams.length === 1 && filteredAudioStreams.length > 0) {
        // Step 2: Check codecs for both video & audio

        if (filteredVideoStreams[0].codec_name !== profile.video.codec) {
          // Transcode video stream
          params.input.push(`-map 0:${filteredVideoStreams[0].index}`);
          params.output.push(`-c:${params.input.length - 1} ${profile.video.codec === 'h264' ? 'libx264' : 'libx265'} -preset ${profile.video.quality} -metadata:s:${params.input.length - 1} title="Video Track" -disposition:${params.input.length - 1} default`);
        } else {
          // Copy video stream
          params.input.push(`-map 0:${filteredVideoStreams[0].index}`);
          params.output.push(`-c:${params.input.length - 1} copy -metadata:s:${params.input.length - 1} title="Video Track" -disposition:${params.input.length - 1} default`);
        }

        for (let stream of filteredAudioStreams) {
          if (profile.language.primary === stream.language) {
            // Primary language
            if (profile.audio.passthrough.includes(stream.codec_name)) {
              // Passthrough codec
              params.input.push(`-map 0:${stream.index}`);
              params.output.push(`-c:${params.input.length - 1} copy -metadata:s:${params.input.length - 1} title="Audio Track (${profile.language.primary})" -disposition:${params.input.length - 1} default`);
            } else {
              // Transcode codec
              params.input.push(`-map 0:${stream.index}`);
              params.output.push(`-c:${params.input.length - 1} ${profile.audio.codec} -ac:${params.input.length - 1} ${profile.audio.channels} -b:${params.input.length - 1} ${profile.audio.quality}k -metadata:s:${params.input.length - 1} title="Audio Track (${profile.language.primary})" -disposition:${params.input.length - 1} default`);
            }
            break;
          }
        }

        for (let stream of filteredAudioStreams) {
          if (profile.language.primary !== stream.language) {
            //Other languages
            params.input.push(`-map 0:${stream.index}`);
            params.output.push(`-c:${params.input.length - 1} copy -metadata:s:${params.input.length - 1} title="Audio Track (${stream.language})" -disposition:${params.input.length - 1} none`);
          }
        }

        // Copy all subtitles
        params.input.push(`-map 0:s?`);
        params.output.push(`-c:s copy`);

        const splittedPath = filename.split('/');
        const fName = splittedPath[splittedPath.length - 1].replace(path.extname(filename), `_${new Date().getTime()}.${profile.container}`);
        ffmpeg(filename, params.input.concat(params.output).join(' '), `/output/${fName}`);
        resolve();
      } else {
        console.log(streams);
        reject(`Could not process: ${filename}`);
        return;
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  mediaProcessor,
};
