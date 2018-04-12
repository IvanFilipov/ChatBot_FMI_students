const winston = require('winston'),
      config = require('./configuration'),
      fs = require( 'fs' ),
      path = require('path');

const dirPath = config.get('logDirectoryPath');

if ( !fs.existsSync( dirPath ) ) {
    // Create the directory if it does not exist
    fs.mkdirSync( dirPath );
}

//how to format the timestamp
const tsFormat = () => {

    let date = new Date();

    return date.toLocaleDateString() + ' / '
        + date.toLocaleTimeString() + ' / ';
}

//how each text to be logged
const formatFunc = (options) => {

    return tsFormat() + ' : ' +
        options.level.toUpperCase() + ' --- ' +
        (options.message ? options.message : '')
        + ' --- ';
}

const logger = new (winston.Logger)({
    transports: [
        //debugger log config
        new (winston.transports.Console)({
                level: 'debug',
                json: false,
                formatter: formatFunc
        }),
        //info logger config
        new (winston.transports.File)({
            name: 'info-file',
            filename: path.join(dirPath, '/infoLog.txt'),
            level: 'info',
            json: false,
            formatter : formatFunc
        }),

        //error logger config
        new (winston.transports.File)({
            name: 'error-file',
            filename: path.join(dirPath, '/errorLog.txt'),
            level: 'error',
            json: false,
            formatter: formatFunc
        
        })
    ]
});

//logger.add(winston.transports.Console);
try{
module.exports = logger;}catch(err)
 {console.log(11)};