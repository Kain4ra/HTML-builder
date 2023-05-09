const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, {withFileTypes: true}, (err, file) => {
  if (err) console.log(err);
  for (let item of file) {
    if (item.isFile()) {
      const filePath = path.join(folderPath, item.name);
      const fileExtend = path.extname(filePath).slice(1);
      const fileName = fileExtend !== '' ? item.name.replace(`.${fileExtend}`, '') : item.name;
      fs.stat(filePath, (err, file) => {
        if (err) console.log(err);
        console.log(`${fileName} - ${fileExtend} - ${(file.size / 1024)}kb`);
      });
    }
  }
});


