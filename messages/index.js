"use strict";
require('dotenv-extended').load();
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");

var bbPromise = require('bluebird');
var request = require('request-promise').defaults({encoding: null});
var utils = require('./utils');

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector({gzipData: true}) : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    gzipData: true
});

var bot = new builder.UniversalBot(connector);
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisVersion = process.env.LuisVersion;

var luisAPIHostName = process.env.LuisAPIHostName;
if (!luisAPIHostName) {
    console.log(`Cognitive Service API hostname environment 
        variable'LuisAPIHostName' is not defined`);
    luisAPIHostName = 'eastus2.api.cognitive.microsoft.com';
}

const LuisModelUrl = `https://${luisAPIHostName}${luisVersion}/application?id=${luisAppId}&subscription-key=${luisAPIKey}`;

var recognizer = new builder.LuisRecognizer(LuisModelUrl);
bot.recognizer(recognizer);

bot.dialog('/', [
    function (session, args, next) {
        let msg = session.message;
        if (msg.attachments.length) {
            let attachment = msg.attachments[0];
            // verify the attachment is an image
            if (!attachment.contentType.match(utils.phrases.IMAGE_REGEX)) {
                session.endDialog(utils.phrases.NOT_AN_IMAGE_ATTACHMENT);
            } else {
                session.dialogData.imageUrl = attachment.contentUrl;
                // check if we know the gender preference, if not, get it
                if (!session.userData.genderPreference) {
                    session.send(utils.phrases.TEXT_ONE_SEC);
                    session.beginDialog('SetGender');
                } else {
                    next();
                }
            }
        } else {
            session.endDialog(utils.phrases.TRY_HELP_MSG, session.message.text);
        }
    },
    function (session, results, next) {
        let imageUrl = session.dialogData.imageUrl;
        let gender = session.userData.genderPreference
        let options = ['price_start', 'price_limit', ];
        let optionals = {};
        for (let opt of options) {
            if (session.userData[opt]) optionals[opt] = session.userData[opt];
        }
        
        // Send request to MTL mirrorlook endpoint
        utils.mtlAapi.mtlmirrorthatlook(
            process.env.MTL_API_ENDPOINT,
            imageUrl,
            gender,
            optionals,
            process.env.MTL_API_SUBSCRIPTION_KEY
        ).then(function (jsondata) {
            // Save jsondata for later use
            session.privateConversationData.lastMirrorCall = jsondata;
            session.replaceDialog('SelectClothingType');
        }).catch(function(err) {
            // We had an error making the call -- send to error dialog
            console.log('error in api call', err.message);
            session.replaceDialog('Error');
        });
    }
]);

// Handle Greetings
bot.dialog('Greet', [
    function (session, args, next) {
        // Get user's name if we don't have it
        if (!session.userData.username) {
            session.userData.username = session.message.address.user.name;
        }
        session.endDialog(`Hi ${session.userData.username}! ${utils.phrases.GREETING}`);
    }
]).triggerAction({
    matches: 'Greet'
});

// Handle cancel and exit dialogs
bot.dialog('Cancel', [
    function (session, args, next) {
        session.endDialog('Ok');
    }
]).triggerAction({
    matches: /^cancel$/i,
})

// Handle help and give instructions on what user can do
bot.dialog('Help', [
    function (session, args, next) {
        session.send(utils.phrases.HELP_GENERAL);
        let optionsValues = [`price`, `gender`, `retailer`, `search`];
        let optionsTitles = [
            utils.phrases.HELP_PRICE_TITLE,
            utils.phrases.HELP_GENTER_TITLE,
            utils.phrases.HELP_RETAILER_TITLE,
            utils.phrases.HELP_IMAGE_TITLE
        ];

        let message = utils.herocard.createMessageWithButtons(
            session,
            builder,
            optionsTitles,
            optionsValues,
            utils.phrases.HELP_TEXT
        );
            
        builder.Prompts.choice(session, message, optionsValues);
    },
    function (session, results) {
        let chocie = results.response.entity;

        switch (chocie) {
            case 'price':
                session.send(utils.phrases.HELP_PRICE_TEXT);
                break;
            case 'gender':
                session.send(utils.phrases.HELP_GENDER_TEXT);
                break;
            case 'retailer':
                session.send(utils.phrases.HELP_RETAILER_TEXT);
                break;
            case 'search':
                session.send(utils.phrases.HELP_SEARCH_TEXT);
                break;
        }

        let options = ['yes', 'no']
        let message = utils.herocard.createMessageWithButtons(
            session,
            builder,
            options, 
            options,
            utils.phrases.TEXT_HELP
        );
        
        setTimeout(function() {
            builder.Prompts.choice(session, message, options);
        }, 1000)
    },
    function (session, results) {
        let choice = results.response.entity;
        if (choice === 'yes') {
            session.replaceDialog('Help');
        } else {
            session.endDialog(utils.phrases.PRO_TIP);
        }
    }
]).triggerAction({
    matches: 'Help'
});

// Handle when there is an error
bot.dialog('Error', function (session) {
    session.endDialog(utils.phrases.ERROR_TEXT);
});

// Handle when browsing based on prefereces
bot.dialog('Browse', [
    function (session, args, next) {
        // Display 10 items at a time based on set preferences
        let products = session.privateConversationData
            .lastMirrorCall[args.clothingType];
        let cursor = Math.max(0,args.cursor);
        console.log('starting cursor at ', cursor);
        
        let productsToShow = products.slice(cursor, cursor + utils.MAX_DISPLAY_CARDS);
        let carouselMessage = utils.carousel.createCarouselFromProducts(
            session,
            builder,
            productsToShow
        );
        
        session.dialogData.clothingType = args.clothingType;
        session.dialogData.cursor =  Math.min(cursor + utils.MAX_DISPLAY_CARDS,
            products.length);
        session.dialogData.productsLength = products.length
        
        session.send(carouselMessage);
        
        next();
    },
    function (session) {
        // Build options for what user can do now
        let options = [];
        let cursor = session.dialogData.cursor;
        let productsLength = session.dialogData.productsLength;
        
        console.log(cursor);
        console.log(productsLength);
        // 1. See next 10 if we have more
        if (cursor < productsLength - 1) options.push(utils.phrases.NEXT_TEN);
        // 2. See prev 10 if we have more
        if (cursor > 10) options.push(utils.phrases.PREV_TEN);
        // 3. Change clothings type (tops, bottom)
        options.push(utils.phrases.CHANGE_CLOTHING_TYPE);
        // 4. Search for something else
        options.push(utils.phrases.SEARCH_OPTION);
        // 5. Change search preferences
        options.push(utils.phrases.CHANGE_SEARCH_PREFS);
        // 6. User is done for now
        options.push(utils.phrases.DONE);

        let message = utils.herocard.createMessageWithButtons(
            session,
            builder,
            options,
            options,
            utils.phrases.BROWSE_NEXT_STEPS
        );
        setTimeout(function () {
            builder.Prompts.choice(session, message, options);
        }, 3000);
    },
    function (session, results) {
        let choice = results.response.entity;
        let clothingType = session.dialogData.clothingType;
        let cursor = session.dialogData.cursor;

        switch(choice) {
            case utils.phrases.NEXT_TEN:
                session.replaceDialog('Browse', {clothingType: clothingType,
                    cursor: cursor})
                break;
            case utils.phrases.PREV_TEN:
                session.replaceDialog('Browse',{clothingType: clothingType,
                    cursor: (cursor-(2*utils.MAX_DISPLAY_CARDS))})
                break;
            case utils.phrases.CHANGE_CLOTHING_TYPE:
                session.replaceDialog('SelectClothingType');
                break;
            case utils.phrases.SEARCH_OPTION:
                session.send(utils.phrases.SEARCH_OPTION_TEXT);
                session.endDialog();
                break;
            case utils.phrases.CHANGE_SEARCH_PREFS:
                session.replaceDialog('Help');
                break;
            case utils.phrases.DONE:
                session.replaceDialog('EndConversation');
        }
    }
]);

// Handle when selecting clothing options available
bot.dialog('SelectClothingType', [
    function (session) {
        // Get the clothing type options
        let options = Object.keys(session.privateConversationData.lastMirrorCall);
        if (options.length > 0) {
            let message = utils.herocard.createMessageWithButtons(
            session,
            builder,
            options, 
            options,
            utils.phrases.CLOTHING_TYPE_TEXT);
            builder.Prompts.choice(session, message,options);
        } else {
            session.send(utils.phrases.NO_RESULTS);
            session.replaceDialog('SetGender');
        }  
    },
    function (session, results) {
        let clothingType = results.response.entity;
        session.replaceDialog('Browse', {clothingType: clothingType,
            cursor: 0});
    }
]);

// Handle to set price range
bot.dialog('SetPriceRange', [
    function (session, args, next) {
        let promptForArray = [];
        let maxPrice, minPrice;
        let maxPriceEntity = args && builder.EntityRecognizer
            .findEntity(args.intent.entities, 'price range::MaxPrice');
        let minPriceEntity = args && builder.EntityRecognizer
            .findEntity(args.intent.entities, 'price range::MinPrice');
        // check to see that we have either max price or min price
        if (maxPriceEntity) {
            maxPrice = maxPriceEntity.entity.replace(/\D/g, '');
        } else {
            promptForArray.push('price_limit')
        }

        if (minPriceEntity) {
            minPrice = minPriceEntity.entity.replace(/\D/g, '');
        } else {
            promptForArray.push('price_start')
        }
        
        if (promptForArray.length == 0) {
            session.userData.price_limit = maxPrice;
            session.userData.price_start = minPrice;
            next()
        } else {
            session.dialogData.promptForArray = promptForArray;
            if (promptForArray[0] == 'price_limit') {
                session.userData.price_start = minPrice || session.userData.price_start;
                builder.Prompts.number(session, utils.phrases.MAX_PRICE_PROMPT);
            } else {
                session.userData.price_limit = maxPrice || session.userData.price_limit;
                builder.Prompts.number(session,utils.phrases.MIN_PRICE_PROMPT);
            }
        }
    },
    function (session, results, next) {
        if (!results || !results.response) {
            next();    
        } else {
            let option = session.dialogData.promptForArray.shift(0);
            session.userData[option] = results.response;
            if (session.dialogData.promptForArray.length == 1) {
                builder.Prompts.number(session, utils.phrases.MIN_PRICE_PROMPT);
            } else {
                next();
            }
        }  
    },
    function (session, results) {
        let maxPrice, minPrice;
        if (results.response) {
            let option = session.dialogData.promptForArray.shift(0);
            session.userData[option] = results.response;
        } 
        
        maxPrice = Math.max(session.userData.price_limit, session.userData.price_start)
        minPrice = Math.min(session.userData.price_limit, session.userData.price_start);
        session.userData.price_limit = maxPrice;
        session.userData.price_start = minPrice;
        session.send(`Maximum price set to ${session.userData.price_limit} and 
            mininum price set to ${session.userData.price_start}.`)
        session.endDialog(utils.phrases.SEND_IMAGE);
    }
]).triggerAction({
    matches: 'SetPriceRange'
});

bot.dialog('GetPriceRange', [
    function (session) {
        if (!session.userData.price_limit || !session.userData.price_start) {
            session.send(utils.phrases.RANGE_UNSET);
            session.replaceDialog('SetPriceRange');
        } else {
            session.send(`The current price range is ${session.userData.price_start}
                to ${session.userData.price_limit}.`);

            let options = ['yes', 'no']
            let message = utils.herocard.createMessageWithButtons(
            session,
            builder,
            options, 
            options,
            utils.phrases.UPDATE_RANGE);
        
            builder.Prompts.choice(session, message,options);
            
        }
    },
    function (session, results) {
        if (results.response.entity.toLowerCase() == "no") {
            session.endDialog(utils.phrases.START_NEW);
        } else {
            session.replaceDialog('SetPriceRange')
        }
    }
]).triggerAction({
    matches: 'GetPriceRange'
});

bot.dialog('GetGender', [
    function (session, args) {
        let gender = session.userData.genderPreference;

        if (gender) {
            session.send(`Your current search gender is set to ${gender}.`);
        } else {
            session.send(utils.phrases.MISSING_GENDER);
            session.replaceDialog('SetGender');
        }
    }
]).triggerAction({
    matches: 'GetGender'
});

bot.dialog('SetGender', [
    function (session) {
        let options = [`Male`, `Female`]
        let message = utils.herocard.createMessageWithButtons(
            session,
            builder,
            options, 
            options,
            utils.phrases.UPDATE_GENDER
        );
        
        builder.Prompts.choice(session, message,options);
    },
    function (session, results) {
        session.userData.genderPreference = results.response.entity;
        session.send(`Thanks! The search gender has been updated to 
            ${results.response.entity}`);
        session.endDialog();
    }
]).triggerAction({
    matches: 'SetGender'
});

bot.dialog('EndConversation', function (session) {
    session.endConversation(utils.phrases.DONE_RESPONSE)
}).triggerAction({
    matches: 'EndConversation'
});

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}

