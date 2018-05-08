require("./config");

require("./modules/api")

require('./library/bt');

require('./library/log4/build');

require('./library/redis/build');

require('./library/robot.js');

var listen = require('./modules/listen');
var mq = require('./modules/mq');
var room = require('./modules/room');
var INmessage = require('./modules/INmessage');
var app = listen.app;

// mq.clients= global.robot;

app.get('/question/get_rand',function(req,res){
	api.get_question_rand().then((data)=>{
		res.send(data);
	})
});

listen.wss.on('connection', function connection(ws) {
    bt.log('链接成功！');
    // 将新用户加入队列
    // console.log(ws);
    console.log(global.userInfo);
    // mq.add(global.userInfo,ws,()=>{
    //     room.handle(global.userInfo.openid);
    // },listen.event.close);
    // 接受消息
    ws.on('message', function incoming(json) {
        INmessage.handle(JSON.parse(json));
    });
});

setInterval(()=>{
    redis.set('mq_list',JSON.stringify(mq.client_list()));
    redis.set('room_list',JSON.stringify(room.get_List()));
},3000);

process.on('uncaughtException', function (err) {
  log.info(err);
  log.info(err.stack);
});
