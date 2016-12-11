const express = require('express'),
      // connect = require('connect'),
      errorhandler = require('errorhandler'),
      morgan = require('morgan'),
      mustacheExpress = require('mustache-express'),
      // mustacheEngine = require('connect-mustache-middleware'),
      bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser'),
      http = require('http');

const port = 3000;
const app = express(); //connect();
const server = app.listen(port);
const io = require('socket.io').listen(server); // this tells socket.io to use our express server

var logins = {
};

// Setup debug vs production
var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
  app.use(errorhandler());
}

// app.use(mustacheEngine.middleware({
//     rootDir: 'views', // path to look mustache templates
//     dataDir: 'mock/data' // path to look for JSON data files
// }))
// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');
app.use(morgan('dev'));
app.use(express.static(__dirname + '/static'));
app.use(cookieParser());
// app.use(bodyParser());

app.get('/index.php/start/', function(req, res) {
  console.log("Sending 302 for", req);
  res.sendStatus(302);
});

app.get('/index.php/welcome/', function(req, res) {
  const data = {
    sessionId: req.cookies.Agavi,
    username: 'azinman'
  };
  console.log("Sending rendered welcome with data", data)
  // Render views/welcome.mustache
  res.render('welcome', data);
});

app.get('/index.php/user/profile/', function(req, res) {
  const authentication_id = req.cookies.Agavi;
  const login = req.cookies["autologin[hash"];
  const user = logins[login];
  if (!user) {
    res.sendStatus(500);
    return;
  }

  const data = {
    "status": "ok",
    "user": {
      "email": user.email,
      "id": user.id,
      "username": user.username,
      "language": "en_US",
      "authentication_id": authentication_id,
      "avatar_id": "0",
      "color_id": user.color_id,
      "game_session": null,
      "is_quickmatch_customs": false,
      "prefered_extension": "seafarer",
      "register_source": "Mozilla\/5.0 (iPhone; CPU iPhone OS 8_3 like Mac OS X) AppleWebKit\/600.1.4 (KHTML, like Gecko) Mobile\/12F70",
      "platform": "web",
      "installed_extensions": "basic",
      "version": "1.0",
      "activation_date": "2015-05-13 07:32:13",
      "activation_key": null,
      "created_date": "2015-05-13 07:31:53",
      "facebook_id": null,
      "gamecenter_id": null,
      "hash": login,
      "last_login": "2016-12-03 08:16:41",
      "last_upload": "0000-00-00 00:00:00",
      "modified_date": "2016-12-03 08:16:41",
      "password": user.password,
      "register_date": "2015-05-13 07:31:53",
      "state": "1120"
    },
    "buddy_ids": user.buddy_ids,
    "blacklist_ids": [],
    "elos": [{
      "ranking": {
        "created_date": "2015-05-13 07:31:54",
        "id": "1188716",
        "modified_date": "2015-06-11 09:49:53",
        "rank": "1000",
        "state": "100",
        "user_id": user.id,
        "games": 0,
        "wins": 0,
        "losses": 0,
        "extension": "basic",
        "previous_rank_1": "1000",
        "previous_rank_2": null,
        "previous_rank_3": null,
        "previous_rank_4": null,
        "previous_rank_5": null,
        "is_won": false,
        "is_won_1": false,
        "is_won_2": false,
        "is_won_3": false,
        "is_won_4": false,
        "is_won_5": false,
        "streak": [{
          "won": false,
          "rank": null
        }, {
          "won": false,
          "rank": null
        }, {
          "won": false,
          "rank": null
        }, {
          "won": false,
          "rank": null
        }, {
          "won": false,
          "rank": null
        }]
      },
      "position": 503371
    }]
  };

  res.json(data);
});

app.get('/index.php/socket/url/', function(req, res) {
  res.json({socket_url: ""})
});

io.sockets.on('connection', function (socket) {
    console.log('A new user connected!');
    // socket.emit('info', { msg: 'The world is round, there is no up or down.' });
});

console.log("Express server listening on port", port);
