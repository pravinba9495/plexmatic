const { exec, execSync } = require("child_process");
const process = require("process");
const { emit } = require("./socket");
let pid = 0;
const kill = () => {
  return new Promise((resolve, reject) => {
    let ps = exec(`kill -15 ${pid}`);
    ps.on("close", (code, signal) => {
      console.log(`Code: ${code}`);
      console.log(`Signal: ${signal}`);
      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(`Non zero exit code, Code: ${code}, Signal: ${signal}`)
        );
      }
    });
  });
};

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
  const command = `ffmpeg -y -i "${path}" ${params} -max_muxing_queue_size 9999 "${output}"`;
  console.log(command);
  return new Promise((resolve, reject) => {
    let ps = exec(command);
    pid = ps.pid;
    ps.stdout.pipe(process.stdout);
    ps.stderr.pipe(process.stdout);
    process.on("SIGINT", () => {
      kill();
    });
    process.on("exit", () => {
      kill();
    });
    process.on("SIGABRT", () => {
      kill();
    });
    ps.on("close", (code, signal) => {
      console.log(`Code: ${code}`);
      console.log(`Signal: ${signal}`);
      if (code === 0) {
        emit("closed");
        resolve();
      } else {
        emit("closed");
        reject(
          new Error(`Non zero exit code, Code: ${code}, Signal: ${signal}`)
        );
      }
    });
  });
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
  kill,
};
