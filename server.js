var https = require('https');
var fs = require('fs');
var app = require('express')();
//logger middleware for Express
app.use(require('morgan')('dev'));

//express sessions
var session = require('express-session');
//saves the session object in JSON files in the local folder (sessions by default). This is not as advanced as other sessions stores, but great for debugging and learning
var FileStore = require('session-file-store')(session);
app.use(session({
    name: 'server-session-cookie-id',
    secret: 'my express secret',
    saveUninitialized: true,
    resave: true,
    store: new FileStore()
}));
app.get('/', function initViewsCount(req, res, next) {
    if (typeof req.session.views === 'undefined') {
      req.session.views = 0;
      return res.end('Welcome to the file session demo. Refresh page!');
    }
    return next();
  });
  app.get('/', function incrementViewsCount(req, res, next) {
    console.assert(typeof req.session.views === 'number',
      'missing views count in the session', req.session);
    req.session.views++;
    return next();
  });
  app.use(function printSession(req, res, next) {
    console.log('req.session', req.session);
    return next();
  });
  app.get('/', function sendPageWithCounter(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.write('<p>views: ' + req.session.views + '</p>\n');
    res.end();
  });

app.get('/', function (req, res) {
    res.send('hi there');
});

//using self-signed certificate to work over https locally
//run npm run make-certificate 
//before using this server
var server = https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
}, app).listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at https://%s:%s', host, port);
});

//SIMPLE VERSION
// var server = app.listen(3000, function() {
//     var host = server.address().address;
//     var port = server.address().port;
//     console.log('Example app listening at http://%s:%s', host, port);
// })