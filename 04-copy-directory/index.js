const fsPromises = require('fs/promises');
const path = require('path');

const pathFolder = path.join(__dirname, 'files');
const pathCopyFolder = path.join(__dirname, 'files-copy');

async function copyFolder() {
  try {
    await fsPromises.mkdir(pathCopyFolder, {recursive: true});
    const files = await fsPromises.readdir(pathFolder);
    const filesCopy = await fsPromises.readdir(pathCopyFolder);
    filesCopy.forEach(async item => {
      if (!files.includes(item)) {
        await fsPromises.unlink(path.join(pathCopyFolder, item));
      }
    });
    files.forEach(async item => {
      await fsPromises.copyFile(path.join(pathFolder, item), path.join(pathCopyFolder, item));
    });
  } catch (err) {
    console.error(err);
  }
}

copyFolder();