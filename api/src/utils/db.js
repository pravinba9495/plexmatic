const { response } = require("express");
const sqlite3 = require("sqlite3");
let { walk, Q } = require("./walk");

const db = new sqlite3.Database("./src/database/sqlite.db", (error) => {
  if (error) {
    console.error(error.message);
  }
  console.log("Connected to the database.");
  init();
});

const init = () => {
  db.run(
    `
		CREATE TABLE IF NOT EXISTS profiles
		 (id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(255), container varchar(255), v_codec varchar(255), v_quality varchar(255), a_codec varchar(255), a_quality int, a_channels int, a_passthrough text, lang_wanted text, lang_primary varchar(255))
		`,
    (error) => {
      if (error) {
        console.error(error);
      }
      console.log("Profiles table created");
    }
  );
  db.run(
    `
		CREATE TABLE IF NOT EXISTS movies
		 (id INTEGER PRIMARY KEY AUTOINCREMENT, file text, type text, path text, parentId int)
		`,
    (error) => {
      if (error) {
        console.error(error);
      }
      console.log("Movies table created");
    }
  );
  db.run(
    `
		CREATE TABLE IF NOT EXISTS tv
		(id INTEGER PRIMARY KEY AUTOINCREMENT, file text, type text, path text, parentId int)
		`,
    (error) => {
      if (error) {
        console.error(error);
      }
      console.log("TV shows table created");
    }
  );
};

const truncateTable = (table) => {
  return new Promise((resolve, reject) => {
    db.run(
      `
			DELETE FROM ${table}
			`,
      (error) => {
        if (error) {
          console.error(error);
          reject(error);
        }
        resolve();
      }
    );
  });
};

const refreshList = (list) => {
  return new Promise(async (resolve, reject) => {
    try {
      await truncateTable(list);
      const data = await refreshData(list);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

const refreshData = (list) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await walk("/" + list);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

const getProfilesFromDb = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `
			SELECT id, name, container, v_codec, v_quality, a_codec, a_quality, a_channels, a_passthrough, lang_wanted, lang_primary from profiles
			`,
      (error, rows) => {
        if (error) {
          reject(error);
        }
        resolve(profileMapper(rows || []));
      }
    );
  });
};

const getProfilebyIdFromDb = (id) => {
  return new Promise((resolve, reject) => {
    db.all(
      `
			SELECT id, name, container, v_codec, v_quality, a_codec, a_quality, a_channels, a_passthrough, lang_wanted, lang_primary from profiles
			WHERE id = ?
			`,
      [id],
      (error, rows) => {
        if (error) {
          reject(error);
        }
        resolve(profileMapper(rows || []));
      }
    );
  });
};

const profileMapper = (rows) => {
  return rows.map((row) => {
    return {
      id: row.id,
      name: row.name,
      container: row.container,
      video: {
        codec: row.v_codec,
        quality: row.v_quality,
      },
      audio: {
        codec: row.a_codec,
        quality: row.a_quality,
        channels: row.a_channels,
        passthrough: row.a_passthrough.split(","),
      },
      language: {
        wanted: row.lang_wanted.split(","),
        primary: row.lang_primary,
      },
    };
  });
};

const saveProfileInDb = (profile) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO profiles
			(name, container, v_codec, v_quality, a_codec, a_quality, a_channels, a_passthrough, lang_wanted, lang_primary)
			VALUES (?,?,?,?,?,?,?,?,?,?)
			`,
      [
        profile.name,
        profile.container,
        profile.video.codec,
        profile.video.quality,
        profile.audio.codec,
        profile.audio.quality,
        profile.audio.channels,
        profile.audio.passthrough.join(),
        profile.language.wanted.join(),
        profile.language.primary,
      ],
      (error) => {
        if (error) {
          reject(error);
        }
        resolve();
      }
    );
  });
};

const saveMoviesInDb = (movies, parentId) => {
  if (!parentId) {
    parentId = 0;
  }
  const insertedIds = [];
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      let stmt = db.prepare(
        `INSERT INTO movies (file, type, path, parentId) VALUES (?,?,?,?)`
      );
      for (let movie of movies) {
        stmt.run(
          movie.file,
          movie.type,
          movie.path,
          parentId,
          function (error) {
            if (error) {
              reject(error);
            }
            insertedIds.push(this.lastID);
          }
        );
      }
      stmt.finalize(async (error) => {
        if (error) {
          reject(error);
        }
        await Promise.all(
          movies.map((movie, index) => {
            if (movie.children.length > 0) {
              return saveMoviesInDb(movie.children, insertedIds[index]);
            } else {
              return Promise.resolve();
            }
          })
        )
        resolve();
      });
    });
  });
};

const saveTvShowsInDb = (tvShows, parentId) => {
  if (!parentId) {
    parentId = 0;
  }
  const insertedIds = [];
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      let stmt = db.prepare(
        `INSERT INTO tv (file, type, path, parentId) VALUES (?,?,?,?)`
      );
      for (let tv of tvShows) {
        stmt.run(
          tv.file,
          tv.type,
          tv.path,
          parentId,
          function (error) {
            if (error) {
              reject(error);
            }
            insertedIds.push(this.lastID);
          }
        );
      }
      stmt.finalize(async (error) => {
        if (error) {
          reject(error);
        }
        await Promise.all(
          tvShows.map((tv, index) => {
            if (tv.children.length > 0) {
              return saveTvShowsInDb(tv.children, insertedIds[index]);
            } else {
              return Promise.resolve();
            }
          })
        )
        resolve();
      });
    });
  });
};

const updateProfileInDb = (profile, id) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE profiles
			SET name = ?, container = ?, v_codec = ?, v_quality = ?, a_codec = ?, a_quality = ?, a_channels = ?, a_passthrough = ?, lang_wanted = ?, lang_primary = ?
			WHERE id = ?
			`,
      [
        profile.name,
        profile.container,
        profile.video.codec,
        profile.video.quality,
        profile.audio.codec,
        profile.audio.quality,
        profile.audio.channels,
        profile.audio.passthrough.join(),
        profile.language.wanted.join(),
        profile.language.primary,
        id,
      ],
      (error) => {
        if (error) {
          reject(error);
        }
        resolve();
      }
    );
  });
};

const getMoviesListFromDb = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `
			SELECT id, file, type, path, parentId from movies
			`,
      (error, rows) => {
        if (error) {
          reject(error);
        }
        resolve(rows || []);
      }
    );
  });
};

const getTvShowsListFromDb = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `
			SELECT id, file, type, path, parentId from tv
			`,
      (error, rows) => {
        if (error) {
          reject(error);
        }
        resolve(rows || []);
      }
    );
  });
};

module.exports = {
  db,
  getProfilesFromDb,
  saveProfileInDb,
  updateProfileInDb,
  getMoviesListFromDb,
  getProfilebyIdFromDb,
  getTvShowsListFromDb,
  saveMoviesInDb,
  saveTvShowsInDb,
  refreshData,
  refreshList,
};
