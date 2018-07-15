import { wrapRequest } from '../../utils';

const telegramBotURL = 'https://api.telegram.org/bot';
const telegramApiKey = '511419584:AAE_Sw0kwX0B1o0Eh8YQEo68AhQwRrwep8o';
const telegramChatId = '603159046';

const getTelegramUserId = wrapRequest(async (phone) => fetch(`${telegramBotURL}${telegramApiKey}/sendContact?chat_id=${telegramChatId}&phone_number=${phone}&first_name=test`));
const getTelegramChatMember = wrapRequest(async (userId) => fetch(`${telegramBotURL}${telegramApiKey}/getChatMember?chat_id=${telegramChatId}&user_id=${userId}`));

const twitterApiKey = 'cQKfCzqLakHIXhdHzW0QfH9VE';
const twitterSecretKey = '0eoiu5LESUIz6IchXRYSvvPD1uZ69BphWWZdXJdM55nibtxPzp';
const twitterURL = 'https://api.twitter.com/oauth2/token?grant_type=client_credentials';
const base64EncodedTwitterKey = btoa(`${twitterApiKey}:${twitterSecretKey}`);

const twitterFriendshipsShowURL = 'https://api.twitter.com/1.1/friendships/show.json';
const twitterUserName = 'omnibazaar';

const checkTwitterFollowing = wrapRequest(async ({ token, username }) => fetch(`${twitterFriendshipsShowURL}?source_screen_name=${username}&target_screen_name=${twitterUserName}`, {
  headers: {
    Authorization: `Bearer ${token}`
  },
}));

const getTwitterBearerToken = wrapRequest(async () => fetch(twitterURL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    Authorization: `Basic ${base64EncodedTwitterKey}`
  },
}));

export { getTelegramUserId, getTelegramChatMember, getTwitterBearerToken, checkTwitterFollowing };
