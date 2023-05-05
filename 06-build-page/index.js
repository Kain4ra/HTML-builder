const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const pathDist = path.join(__dirname, 'project-dist');
const pathAssets = path.join(__dirname, 'assets');
const pathCopyAssets = path.join(pathDist, 'assets');

// Создание папки Dist
async function createFolder() {
  try {
    await fsPromises.mkdir(pathDist, {recursive: true});
  } catch (err) {
    console.log(err);
  }
}
createFolder();

// Cоздание папок Assets и копирование их содержимого
async function copyDerectory(pathOrigin, pathCopy) {
  try {
    await fsPromises.mkdir(pathCopy, {recursive: true});
    const files = await fsPromises.readdir(pathOrigin, {withFileTypes: true});
    for (let file of files) {
      const newPathOrigin = path.join(pathOrigin, file.name);
      const newPathCopy = path.join(pathCopy, file.name);
      if (!file.isFile()) {
        await copyDerectory(newPathOrigin, newPathCopy);
      } else {
        await fsPromises.copyFile(newPathOrigin, newPathCopy);
      }
    }
  } catch (err) {
    console.log(err);
  }
}
copyDerectory(pathAssets, pathCopyAssets);

// Сохранение компонентов
const pathComponents = path.join(__dirname, 'components');

async function readComponents() {
  const files = await fsPromises.readdir(pathComponents);
  const components = {};
  for (const item of files) {
    const key = item.split('.')[0];
    const code = await fsPromises.readFile(path.join(pathComponents, `${key}.html`));
    components[key] = code.toString();
  }
  return components;
}

// Замена шаблонов в html
const pathTemplate = path.join(__dirname, 'template.html');
const pathIndex = path.join(pathDist, 'index.html');
const pattern = /{{(.*?)}}/g;
const readStream = fs.createReadStream(pathTemplate);
const writeStream = fs.createWriteStream(pathIndex);

readStream.on('data', async (data) => {
  const components = await readComponents();
  let modData = data.toString();
  let match;
  while ((match = pattern.exec(data)) !== null) {
    modData = modData.replace(`{{${match[1]}}}`, components[match[1]]);
  }
  writeStream.write(modData);
});

// Объединение стилей
const pathStyles = path.join(__dirname, 'styles');
const pathBundle = path.join(pathDist, 'style.css');

fs.readdir(pathStyles, {withFileTypes: true}, (err, files) => {
  if (err) console.log(err);
  let nameFiles = [];
  for (let file of files) {
    if (file.isFile()) {
      if (/\.css$/.test(file.name)) {
        nameFiles.push(file.name);
      }
    }
  }

  const writeStream = fs.createWriteStream(pathBundle);

  for (let i = 0; i < nameFiles.length; i++) {
    const readStream = fs.createReadStream(path.join(pathStyles, nameFiles[i]));
    readStream.pipe(writeStream);
  }
});