var mq = require("./mq");
var room = require("./room");
var fs = require('fs');
var express = require('express');
var url = require('url');
// var https = require('https');

var app = express();

var cfg = {
	ssl: true,
	port: 8100,
	ssl_key: './ssl/ssl.key',
	ssl_cert: './ssl/ssl.crt'
};

var httpServ = (cfg.ssl) ? require('https') : require('http');

var server = null;

// // dummy request processing
// var processRequest = function(req, res) {
// 	res.writeHead(200);
// 	res.end('All glory to WebSockets!\n');
// };

// var server = httpServ.createServer({
// 	'key': fs.readFileSync(cfg.ssl_key),
// 	'cert': fs.readFileSync(cfg.ssl_cert)
// }).;

if (cfg.ssl) {
	server = httpServ.createServer({
		'key': fs.readFileSync(cfg.ssl_key),
		'cert': fs.readFileSync(cfg.ssl_cert)
	});
} else {
	server = httpServ.createServer();
}

var webSocketServer = require("ws").Server,
	wss = new webSocketServer({
		// port: cfg.port,
		verifyClient: socketVerify,
		server: server
	});
// app.use(function(req, res) {
// 	res.send({
// 		msg: "hello"
// 	});
// });

server.on('request', app);
server.listen(cfg.port, function() {
	console.log('Listening on ' + server.address().port)
});

// wss.on('connection', function(wsConnect) {
// 	wsConnect.on('message', function(message) {
// 		console.log(message);
// 		wsConnect.send('reply');
// 	});
// });

function socketVerify(info) {
	if (info.req.url) {
		global.userInfo = {
			openid: info.req.headers.openid,
			avatarUrl: info.req.headers.avatarurl,
			nickName: decodeURIComponent(info.req.headers.nickname),
			status: info.req.headers.status
		};

		if (info.req.headers.hasOwnProperty('roomid')) {
			global.userInfo.room_id = info.req.headers.roomid;
		}
	}
	return true;
}

// console.log(`WS启动成功，端口号${8100}`);

let _listen = {
	// 用户下线后，进行用户数据移除
	close(code, openid) {
		//bt.log('退场 ' + code + " " + openid);
		// 清理房间
		room.quit(openid);
		// 清理用户
		room.remove(openid)
	}
}

module.exports = {
	wss: wss,
	event: _listen,
	app:app
};