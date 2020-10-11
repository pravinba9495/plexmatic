const { execSync } = require("child_process");

const ffprobe = (path) => {
  const { streams } = JSON.parse(
    execSync(
      `ffprobe -show_streams -show_entries streams:format=filename -of json "${path}"`,
      {
        stdio: "pipe",
      }
    ).toString()
  );
  return {
    streams,
  };
};

const ffmpeg = (path, params, output) => {
  const command = `ffmpeg -y -i "${path}" ${params} "${output}"`;
  return execSync(command, {
    stdio: "pipe",
  }).toString();
};

const rename = (path, newPath) => {
  const command = `mv "${path}" "${newPath}"`;
  return execSync(command, {
    stdio: "pipe",
  }).toString();
};

module.exports = {
  rename,
  ffprobe,
  ffmpeg,
};
