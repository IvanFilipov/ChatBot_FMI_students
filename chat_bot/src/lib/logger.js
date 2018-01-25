const winston = require('winston');

const tsFormat = () => {

    let date = new Date();

    return date.toLocaleDateString() + ' / '
        + date.toLocaleTimeString() + ' / ';

}

const formatFunc = (options) => {

    return tsFormat() + ' : ' +
        options.level.toUpperCase() + ' --- ' +
        (options.message ? options.message : '')
        + ' --- ';


}

const logger = new (winston.Logger)({
    transports: [

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

module.exports = logger;