const axios = require('axios');

const config = require('./configuration');

const moodleConfig = config.get('moodleConfig'),
      moodleToken = config.get('mToken');

//a request template to get 
//a forum news from moodle
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

//a request template to get 
//a forum news from moodle
const assignReq = axios.create({

    url : moodleConfig.serviceUrl ,
    baseURL: moodleConfig.baseUrl,
    method : 'get',
    timeout: 5000,

    params: {
        wstoken: moodleToken,
        wsfunction : moodleConfig.fun_assignments,
        courseids : [moodleConfig.courseid],
        moodlewsrestformat : 'json'
    },
    
});

//a request to get a user
//from moodle by faculty number
const userReq = axios.create({

    url : moodleConfig.serviceUrl ,
    baseURL: moodleConfig.baseUrl,
    method : 'get',
    timeout: 3000,

    params: {
        wstoken: moodleToken,
        wsfunction : moodleConfig.fun_user,
        field : moodleConfig.field,
        values : [0],
        moodlewsrestformat : 'json'
    },
    
});

//a request template to get 
//all courses that a student is enrolled to 
const coursesReq = axios.create({

    url : moodleConfig.serviceUrl ,
    baseURL: moodleConfig.baseUrl,
    method : 'get',
    timeout: 5000,

    params: {
        wstoken: moodleToken,
        wsfunction : moodleConfig.fun_courses,
        userid : 0,
        moodlewsrestformat : 'json'
    },
    
});

//a request template to get 
//all grades for a given student
const gradesReq = axios.create({

    url : moodleConfig.serviceUrl ,
    baseURL: moodleConfig.baseUrl,
    method : 'get',
    timeout: 5000,

    params: {
        wstoken: moodleToken,
        wsfunction : moodleConfig.fun_grades,
        courseid : moodleConfig.courseid,
        userid : 0,
        moodlewsrestformat : 'json'
    },
    
});

module.exports = {
    forumReq, assignReq, userReq,
    gradesReq, coursesReq
};
     