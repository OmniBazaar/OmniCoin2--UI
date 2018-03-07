import {subscriber as connectionSubscriber} from './blockchain/connection/connectionSaga';
import {subscriber as authSubscriber} from './blockchain/auth/authSaga';
import { sendMailSubscriber } from './mail/mailSaga';
import { fetchMessagesFromFolderSubscriber } from './mail/mailSaga';

export {
    connectionSubscriber,
    authSubscriber,
    sendMailSubscriber,
    fetchMessagesFromFolderSubscriber
}