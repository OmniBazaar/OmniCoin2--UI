import { wrapRequest } from '../../utils';

const telegramBotURL = 'https://api.telegram.org/bot';
const telegramApiKey = '511419584:AAE_Sw0kwX0B1o0Eh8YQEo68AhQwRrwep8o';
const telegramChatId = '603159046';

const getTelegramUserId = wrapRequest(async (phone) => fetch(`${telegramBotURL}${telegramApiKey}/sendContact?chat_id=${telegramChatId}&phone_number=${phone}&first_name=test`));
const getTelegramChatMember = wrapRequest(async (userId) => fetch(`${telegramBotURL}${telegramApiKey}/getChatMember?chat_id=${telegramChatId}&user_id=${userId}`));

export { getTelegramUserId, getTelegramChatMember };
