import config from '../../config/config';

export const sendmail = (username, errorlog) => {
    fetch(config.mailServer, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                errorlog
            })
    }).then(res => console.log('RESPONSE ', res));
}