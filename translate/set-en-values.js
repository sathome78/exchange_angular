const fs = require('fs');
const path = require('path');

const config = {
  dir: './baseJSON', // <-- your json translations directory
  outDir: './lastKeysJson'
};

fs.readdirSync(config.dir).forEach(file => {
  if (path.extname(file) === '.json') {

    const filePath = `${config.dir}/${file}`;
    const json = fs.readFileSync(filePath, 'utf-8');
    const obj = JSON.parse(json);

    Object.keys(obj).forEach(key => {
      if (obj[key] === '') {
        obj[key] = key;
      }
    });

    const outFile = `${config.outDir}/${file}`;
    const str = JSON.stringify(obj, null, '\t');
    fs.writeFileSync(outFile, str, 'utf-8');

  }
});
