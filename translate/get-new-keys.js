const fs = require('fs');
const path = require('path');

const config = {
  refreshKeys: '../src/assets/i18n/dashboard',
  dir: './baseJSON',
  outDir: './lastKeysJson'
};

fs.readdirSync(config.dir).forEach(baseFile => {

  let fetchedKeysJson;

  if (path.basename(baseFile) === '_app.json') {
    fetchedKeysJson = JSON.parse(fs.readFileSync(`${config.dir}/${baseFile}`, 'utf-8'));

  };

  if (!!fetchedKeysJson) {
    fs.readdirSync(config.refreshKeys).forEach(file => {
      let candidate = {};
      let itemKeys = [];
      if (path.extname(file) === '.json') {

        const filePath = `${config.refreshKeys}/${file}`;
        const json = fs.readFileSync(filePath, 'utf-8');
        const obj = JSON.parse(json);


        Object.keys(obj).forEach(exKey => {
          itemKeys.push(exKey);
        });

        Object.keys(fetchedKeysJson).forEach(key => {
          if (!itemKeys.includes(key)) {
             candidate[key] = "";
          }
        })

        const outFile = `${config.outDir}/${file}`;
        const str = JSON.stringify(candidate, null, '\t');
        fs.writeFileSync(outFile, str, 'utf-8');

      }
    });
  }

})
