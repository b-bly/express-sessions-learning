var FileCookieStore = require('tough-cookie-filestore');
var requestPromise = require('request-promise');

//store cookies in cookies.json
var rp = requestPromise.defaults({
    strictSSL: false, //allow use of self-signed cert for testing
    rejectUnauthorized: false,
    jar: requestPromise.jar(new FileCookieStore('cookies.json'))
});

//make a request to server.js and log response
function requestPage() {
    return (rp('http://localhost:3000/'));
}
requestPage()
    .then(console.dir)
    .then(requestPage)
    .then(console.dir)
    .catch(console.error);