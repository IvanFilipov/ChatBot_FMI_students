const config = require('./configuration');

const moodleConfig = config.get('moodleConfig');

const moodleToken = config.get('mToken');

const axios = require('axios');

const forumReq = axios.create({

    url : moodleConfig.serviceUrl ,
    baseURL: moodleConfig.baseUrl,
    method : 'get',
    timeout: 2000,

    params: {
        wstoken: moodleToken,
        wsfunction : moodleConfig.fun_forumDiscussions,
        forumid : moodleConfig.forumid,
        moodlewsrestformat : 'json'
    },
    
});

const assignReq = axios.create({

    url : moodleConfig.serviceUrl ,
    baseURL: moodleConfig.baseUrl,
    method : 'get',
    timeout: 10000,

    params: {
        wstoken: moodleToken,
        wsfunction : moodleConfig.fun_assignments,
        courseids : [moodleConfig.courseid],
        moodlewsrestformat : 'json'
    },
    
});

const userReq = axios.create({

    url : moodleConfig.serviceUrl ,
    baseURL: moodleConfig.baseUrl,
    method : 'get',
    timeout: 10000,

    params: {
        wstoken: moodleToken,
        wsfunction : moodleConfig.fun_user,
        courseid : moodleConfig.courseid,
        moodlewsrestformat : 'json'
    },
    
});

const gradesReq = axios.create({

    url : moodleConfig.serviceUrl ,
    baseURL: moodleConfig.baseUrl,
    method : 'get',
    timeout: 10000,

    params: {
        wstoken: moodleToken,
        wsfunction : moodleConfig.fun_grades,
        courseid : moodleConfig.courseid,
        userid : 0,
        moodlewsrestformat : 'json'
    },
    
});

module.exports = { forumReq , assignReq, userReq, gradesReq };
     