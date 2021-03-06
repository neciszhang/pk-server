// 消息输出端,发送消息到客户端

var mq = require('./mq');

var _out_message = {
	handle(room) {
		(async () => {
			let question_list = await api.get_question_rand();
			// console.log(question_list);
			let members = [];
			for (let user of room.members) {
				// bt.log(user);
				members.push({
					openid: user.openid,
					avatarUrl: user.avatarUrl,
					nickName: user.nickName
				});
			}
			for (let user of room.members) {
				let msg = {
					room_id: room.id,
					type: _config.message_type.pk_start,
					msg: 'start game',
					question: question_list,
					members: members
				}
				if (user.openid.indexOf('TEMPJR') == -1) {
					// console.log(user.openid);
					console.log(msg);
					mq.wss[user.openid].send(JSON.stringify(msg));
				}
				// user.ws.send( JSON.stringify(msg) );
			}
		})();
	},
	// 答题结果发送给好友
	answer_result(res) {
		// 只有在线用户可以推送
		if (res && res.hasOwnProperty('firend') && res.firend.hasOwnProperty('openid')) {
			if (res.firend.openid.indexOf('TEMPJR') == -1 && res.firend.openid in mq.wss) {
				mq.wss[res.firend.openid].send(JSON.stringify(res));
			}
		}
	},
	// 通知可以开始好友PK，通知消息，未并正式开始
	firend_pk_start_message(res) {
		res.type = _config.message_type.firend_pk_start_message;
		for (let user of res.members) {
			if (user.openid.indexOf('TEMPJR') == -1 && mq.wss[user.openid]) {
				mq.wss[user.openid].send(JSON.stringify(res));
			}
		}
	},
	// 用户提前退场，通知到对战好友
	user_quit(res) {
		res.type = _config.message_type.firend_pk_user_quit_message;
		if (res.openid.indexOf('TEMPJR') == -1 && mq.wss_exist(res.openid)) {
			mq.wss[res.openid].send(JSON.stringify(res));
		}
	}
}

module.exports = _out_message;