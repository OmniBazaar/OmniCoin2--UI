/**
 * created by alaverdyanrafayel on 08/07/18
 */
import cryptoJs from 'crypto-js';
import { wrapRequest } from '../../utils';

// data necessary for working with the Telegram  account

const telegramBotURL = 'https://api.telegram.org/bot';
const telegramApiKey = '511419584:AAE_Sw0kwX0B1o0Eh8YQEo68AhQwRrwep8o';
const telegramChatId = '603159046';

// check if the user is connected to the OmniBazaar Telegram account

const getTelegramUserId = wrapRequest(async (phone) => fetch(`${telegramBotURL}${telegramApiKey}/sendContact?chat_id=${telegramChatId}&phone_number=${phone}&first_name=test`));
const getTelegramChatMember = wrapRequest(async (userId) => fetch(`${telegramBotURL}${telegramApiKey}/getChatMember?chat_id=${telegramChatId}&user_id=${userId}`));

// data necessary for working with the Twitter API

const twitterApiKey = 'cQKfCzqLakHIXhdHzW0QfH9VE';
const twitterSecretKey = '0eoiu5LESUIz6IchXRYSvvPD1uZ69BphWWZdXJdM55nibtxPzp';
const twitterURL = 'https://api.twitter.com/oauth2/token?grant_type=client_credentials';
const base64EncodedTwitterKey = btoa(`${twitterApiKey}:${twitterSecretKey}`);
const twitterFriendshipsShowURL = 'https://api.twitter.com/1.1/friendships/show.json';
const twitterUserName = 'omnibazaar';

// get access_token to be able to post requests to the Twitter API

const getTwitterBearerToken = wrapRequest(async () => fetch(twitterURL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    Authorization: `Basic ${base64EncodedTwitterKey}`
  },
}));

// check if the user is following the OmniBazaar twitter account

const checkTwitterFollowing = wrapRequest(async ({ token, username }) => fetch(`${twitterFriendshipsShowURL}?source_screen_name=${username}&target_screen_name=${twitterUserName}`, {
  headers: {
    Authorization: `Bearer ${token}`
  },
}));

// data necessary for working with the MailChimp API

const mailChimpURL = 'https://us3.api.mailchimp.com/3.0/lists';
const mailChimpApiKey = '8da54e67e8c98178be85929400d26e67-us3';
const mailChimplistId = 'c16c70b3c4';

// check if the user is subscribed to the OmniBazaar MailChimp account

const checkMailChimpSubscribed = wrapRequest(async ({ email }) => fetch(`${mailChimpURL}/${mailChimplistId}/members/${cryptoJs.MD5(email)}`, {
  method: 'GET',  
  headers: {
    Authorization: `Basic ${mailChimpApiKey}`
  },
}));

export { getTelegramUserId, getTelegramChatMember, getTwitterBearerToken, checkTwitterFollowing, checkMailChimpSubscribed };
