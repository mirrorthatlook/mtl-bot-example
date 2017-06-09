/**
 * Phrase and responses that the bot will use
 */

const GREETING = `Start shopping by sending us a picture of an outfit
    you like. Type 'help' at any point to see what else you can do. Happy
    shopping.`;

const NOT_AN_IMAGE_ATTACHMENT = `The attachment you sent is not an image. Try
    sending an image attachment instead.`;

const UPDATE_GENDER = `Select Male or Female to update the gender search preference.`;
const TRY_HELP_MSG = `Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.`;
const BROWSE_NEXT_STEPS = `What would you like to do next?`;
const IMAGE_REGEX = /image\/\s*/;

const NEXT_TEN = `See next 10 items`;
const PREV_TEN = `See previous 10 items`;
const CHANGE_CLOTHING_TYPE = `Change clothing type`;
const SEARCH_OPTION = `Search for something else`;
const SEARCH_OPTION_TEXT = `Sure, send me another image when you are ready`;
const CHANGE_SEARCH_PREFS = `Change search preferences`;
const CLOTHING_TYPE_TEXT = `What type of clothing are you interested in?`;
const DONE = `None of these. I'm done for now`;
const DONE_RESPONSE = `No problem. I hope to see you again soon. Bye.`;
const SEND_IMAGE = `Send an image to search`;
const RANGE_UNSET = `Price range is not set.`;
const UPDATE_RANGE = `Would you like to update the price range?`;
const START_NEW = `Great. Start another search by sending an image.`

const ERROR_TEXT = `Woah! Seems my brain is spinning today and I can't figure out
    what's going on. I'm going to take a nap. Let's talk in a few hours :)`;

const HELP_TEXT = `Select an option below for detailed help`;
const MISSING_GENDER = `Looks like you haven't set the gender to search for yet.`;

const HELP_IMAGE_TITLE = `How do I search for items?`;
const HELP_PRICE_TITLE = `How do I set the price range?`;
const HELP_RETAILER_TITLE = `How do I filter retailers?`;
const HELP_GENTER_TITLE = `How do I change gender preference?`;

const HELP_PRICE_TEXT = `You can get the current price range by typing 
    something like 'price range'. You can also update the price the same way
    or with something like 'set price range from $20 to $100'. `;
const HELP_GENDER_TEXT = `You can get the current gender by typing something 
    like 'what gender?' You can update the gender preference with something 
    like 'set gender'.`;
const HELP_RETAILER_TEXT = `You can see all the retailers by typing 'places to 
    shop from'. You can see if we have items from a particular retailer by 
    asking something like 'do you have things from Macys?' You can also 
    update your search preferences to search from a particular retailer. You 
    can set the preference by typing something like 'shop from Macys'. To see 
    if your searches are limited by a retailer, you can ask 'what store 
    am I on?'`;
const HELP_SEARCH_TEXT = `Send an image at any point to start a new search.`;
const HELP_GENERAL = `Type 'cancel' at any point if you get stuck.`;

const TEXT_ONE_SEC = `One sec... I need to know the gender to search for.`;
const TEXT_HELP = `Can I help you with something else?`;
const PRO_TIP = `Ok. Here is a pro tip: type 'cancel' at any point in 
    converstaions if you get stuck.`;
const NO_RESULTS = `I didn't find anything for this. Try changing the gender
    and sending the image again.`;
const MAX_PRICE_PROMPT = `What would you like your max price to be when 
    searching?`
const MIN_PRICE_PROMPT = `What would you like your min price to be when
    searching?`

exports.GREETING = GREETING;
exports.NOT_AN_IMAGE_ATTACHMENT = NOT_AN_IMAGE_ATTACHMENT;
exports.TRY_HELP_MSG = TRY_HELP_MSG;
exports.BROWSE_NEXT_STEPS = BROWSE_NEXT_STEPS;
exports.IMAGE_REGEX = IMAGE_REGEX;
exports.NEXT_TEN = NEXT_TEN;
exports.PREV_TEN = PREV_TEN;
exports.CHANGE_CLOTHING_TYPE = CHANGE_CLOTHING_TYPE;
exports.SEARCH_OPTION = SEARCH_OPTION;
exports.SEARCH_OPTION_TEXT = SEARCH_OPTION_TEXT;
exports.CHANGE_SEARCH_PREFS =CHANGE_SEARCH_PREFS;
exports.CLOTHING_TYPE_TEXT = CLOTHING_TYPE_TEXT;
exports.DONE = DONE;
exports.DONE_RESPONSE = DONE_RESPONSE;
exports.ERROR_TEXT = ERROR_TEXT;
exports.HELP_TEXT = HELP_TEXT;
exports.UPDATE_GENDER = UPDATE_GENDER;
exports.HELP_PRICE_TEXT = HELP_PRICE_TEXT;
exports.HELP_GENDER_TEXT = HELP_GENDER_TEXT;
exports.HELP_RETAILER_TEXT = HELP_RETAILER_TEXT;
exports.HELP_SEARCH_TEXT = HELP_SEARCH_TEXT;
exports.HELP_GENERAL = HELP_GENERAL;
exports.TEXT_ONE_SEC = TEXT_ONE_SEC;
exports.TEXT_HELP = TEXT_HELP;
exports.PRO_TIP = PRO_TIP;
exports.NO_RESULTS = NO_RESULTS;
exports.MAX_PRICE_PROMPT = MAX_PRICE_PROMPT;
exports.MIN_PRICE_PROMPT = MIN_PRICE_PROMPT;
exports.SEND_IMAGE = SEND_IMAGE;
exports.RANGE_UNSET = RANGE_UNSET;
exports.UPDATE_RANGE = UPDATE_RANGE;
exports.START_NEW = START_NEW;
exports.MISSING_GENDER = MISSING_GENDER;
exports.HELP_IMAGE_TITLE = HELP_IMAGE_TITLE;
exports.HELP_PRICE_TITLE = HELP_PRICE_TITLE;
exports.HELP_RETAILER_TITLE = HELP_RETAILER_TITLE;
exports.HELP_GENTER_TITLE = HELP_GENTER_TITLE;