module.exports = {


    //will be used to remember language settings
    usersStates : {},
    
    //language number constants
    BG : 1,
    EN : 0,
    
    //all supported commands
    commandList : ['/lang bg' , '/lang en', '/start'],


    //keyboardOptions[0] - > object with options in EN
    //keyboardOptions[1] - > with options in BG
    keyboardOptions : [ 
        
        {  
            'reply_markup': {
        
                'keyboard': [
                    ['News'],
                    ['Events', 'Personal info'],
                    ['General information'],
                    ['Test my knowledge']
                ]
            }
        
        },

        {

        'reply_markup': {
            
                    'keyboard': [
                        ['Новини'],
                        ['Събития', 'Персонална инфо'],
                        ['Обща информация'],
                        ['Тествай познанията ми']
                    ]
                }
            }
    ],

    unknownCommand : [
        'I don\'t understand you 😓'
        ,
        'Не те разбирам 😓'
    ],

    languageChanged :[
        'Now we are talking in english! 🇬🇧󠁧󠁢󠁥󠁮󠁧󠁿'
        ,
        'Вече си говорим на български! 🇧🇬'
    ]

};