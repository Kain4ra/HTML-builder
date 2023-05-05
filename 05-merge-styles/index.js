const fs = require('fs');
const path = require('path');


const pathStyles = path.join(__dirname, 'styles');
const pathBundle = path.join(__dirname, 'project-dist' , 'bundle.css');

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