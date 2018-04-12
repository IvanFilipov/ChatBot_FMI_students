const fs = require('fs'),
    path = require('path'),
    nconf = require('nconf');

//a wrapper class for working with nconf
class Config {

    constructor() {

        //everything will be 'in-memory'
        nconf.use('memory');

        //take all arguments from the command line
        nconf.argv();

        nconf.required(['bToken', 'mToken', 'configFile']);

        //loading all config data
        nconf.add('conf', { type: 'file', file: nconf.get('configFile')});

        //will throw an error if any key is missing
        nconf.required(['externalLinks', 'questionsPath',
                        'moodleConfig', "logDirectoryPath"]);

        //loading all questions
        nconf.add('quest', { type: 'file', file: nconf.get('questionsPath') });
        //adding it to the required fields
        nconf.required(['questions']);

    }

    get(key) {

        return nconf.get(key);
    }
}

//only one instance
let config;

//if one of the keys is missing 
//the program cannot start...
try {

    config = new Config();
    
} catch (err) {

    console.error('FATAL ERROR WHILE INITIALIZATION : ' + err.toString());
    process.exit(-1);
}

module.exports = config;