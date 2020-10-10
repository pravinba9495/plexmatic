const { profile } = require("console");
const { ffprobe } = require("./bash");
const { getProfilebyIdFromDb } = require("./db");

const mediaProcessor = (media) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { profileId, filename } = media;
      console.log({ profileId, filename });
      const profile = await getProfilebyIdFromDb(profileId);
      console.log(profile);
      const streams = ffprobe(filename);
      console.log(streams);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  mediaProcessor,
};
