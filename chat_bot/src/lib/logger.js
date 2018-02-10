const winston = require('winston');

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
            filename: '../log/info.log',
            level: 'info',
            json: false,
            formatter : formatFunc
        }),

        //error logger config
        new (winston.transports.File)({
            name: 'error-file',
            filename: '../log/error.log',
            level: 'error',
            json: false,
            formatter: formatFunc
        
        })
    ]
});

//logger.add(winston.transports.Console);
module.exports = logger;