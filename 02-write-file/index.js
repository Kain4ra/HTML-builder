const fs = require('fs');
const path = require('path');
const process = require('process');
const readLine = require('readline');

const inputText = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
});
const filePath = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(filePath);

function writeText() {
  inputText.question('Введите текст: ', (text) => {
    if (text === 'exit') {
      inputText.close();
    }
    else {
      writeStream.write(text);
      writeText();
    }
  });
}

process.on('exit', () => {
  console.log('\nВвод завершен, данные сохранены в файле.');
  inputText.close();
  process.exit();
});

writeText();