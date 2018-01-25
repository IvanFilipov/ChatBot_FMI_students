const config = require('./configuration');

const moodleConfig = config.get('moodleConfig');

const moodleToken = config.get('mToken');

const axios = require('axios');

const forumReq = axios.create({

    url : moodleConfig.serviceUrl ,
    baseURL: moodleConfig.baseUrl,
    method : 'get',
    timeout: 5000,

    params: {
        wstoken: moodleToken,
        wsfunction : moodleConfig.fun_forumDiscussions,
        forumid : moodleConfig.forumid,
        moodlewsrestformat : 'json'
    },
    
});

module.exports = forumReq;
     