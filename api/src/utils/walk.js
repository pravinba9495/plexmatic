const fs = require('fs').promises;
const path = require('path');

const walk = async (dir) => {
	let files = await fs.readdir(dir);
	files = await Promise.all(files.map(async file => {
		const filePath = path.join(dir, file);
		const stats = await fs.stat(filePath);
		if (stats.isDirectory()) return {
			file,
			path: filePath,
			children: await walk(filePath)
		};
		else if (stats.isFile()) {
			return {
				file,
				path: filePath,
				children: []
			};
		}
	}));

	return files.reduce((all, folderContents) => {
		return all.concat(folderContents);
	}, []);
};

module.exports = {
	walk,
};