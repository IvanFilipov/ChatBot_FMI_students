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

        //loading all questions
        nconf.add('quest', { type: 'file', file: '../info_base/questions.json' });

        //loading all config data
        nconf.add('conf', { type: 'file', file: '../info_base/config.json' });
    }

    get(key) {

        return nconf.get(key);

    }

}

const config = new Config();

module.exports = config;