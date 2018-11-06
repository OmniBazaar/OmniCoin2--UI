export const sendmail = (username, errorlog) => {
    fetch('http://35.171.116.3/sendmail/', {
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