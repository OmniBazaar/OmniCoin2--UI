import messages from './messages';

export default {
    200: messages.priorityHighest,
    150: messages.priorityHigher,
    100: messages.priorityHigh,
    50: messages.priorityNormal,
    0: messages.priorityLow
};