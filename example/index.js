const parse = require('../dist/index').default;
const { readFile, writeFile } = require('fs');
const { cloneDeep } = require('lodash');

const settings = {
    loc: true,
    source: `${__dirname}/data.json`
};


readFile(settings.source, 'utf-8', (err, data) => {
    if (err) {
        console.log(err.message);
        return;
    }
    const result = parse(data, settings);


    try {
        const v = cloneDeep(result.children[0]);

        debugger;

        v.value.value = 'test'

    } catch (e) {
        console.log(e.message)
    }

});