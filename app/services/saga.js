import {subscriber as connectionSubscriber} from './blockchain/connection/connectionSaga';
import {subscriber as authSubscriber} from './blockchain/auth/authSaga';
import { sendMailSubscriber,
         subscribeForMailSubscriber,
         mailReceivedSubscriber,
         confirmationRecievedSubscriber,
         loadFolderSubscriber,
         deleteMailSubscriber,
         mailSetReadSubscriber } from './mail/mailSaga';

export {
    connectionSubscriber,
    authSubscriber,
    sendMailSubscriber,
    subscribeForMailSubscriber,
    mailReceivedSubscriber,
    confirmationRecievedSubscriber,
    loadFolderSubscriber,
    deleteMailSubscriber,
    mailSetReadSubscriber
}
