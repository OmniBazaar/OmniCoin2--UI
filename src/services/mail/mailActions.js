import { createAction } from 'redux-actions';

export const SEND_MAIL = 'SEND_MAIL';
export const SHOW_COMPOSE = 'SHOW_COMPOSE';
export const SET_ACTIVE_FOLDER = 'SET_ACTIVE_FOLDER';
export const SET_ACTIVE_MESSAGE = 'SET_ACTIVE_MESSAGE';
export const GET_MESSAGES = 'GET_MESSAGES';
export const SHOW_REPLY = 'SHOW_REPLY';

export const sendMail = createAction(SEND_MAIL);
export const showComposeModal = createAction(SHOW_COMPOSE);
export const setActiveFolder = createAction(SET_ACTIVE_FOLDER);
export const setActiveMessage = createAction(SET_ACTIVE_MESSAGE);
export const getMessages = createAction(GET_MESSAGES);
export const showReplyModal = createAction(SHOW_REPLY);
