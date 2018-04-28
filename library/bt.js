let bt = function() {}

bt.prototype.show = function(title, msg, func = null) {
	wx.showModal({
		title: title,
		showCancle: false,
		content: msg,
		success: function(res) {
			if (func) {
				func();
			}
		}
	})
}

bt.prototype.toast = function(title = '用户登陆中...', time = 10000, icon = 'none', func = null) {
	wx.showToast(
		title: title,
		icon: icon,
		mask: true,
		duration: time,
		success: function(res) {
			if (func) {
				func();
			}
		}
	})
}

bt.prototype.toast_hide = function(argument) {
	wx.hideToast();
}

bt.prototype.log = function(val) {
	console.log(val);
}

bt.prototype.go = function(url) {
	wx.navigateTo({
		url: url
	});
}

bt.prototype.redirect = function(url, data = null) {
	wx.redirectTo({
		url: url
	});
}

bt.prototype.tap_double = function(e) {
	if ((e.timeStamp - setting.config.tap_time) < setting.config.tap_time_min) {
		setting.config.tap_time = e.timeStamp;
		return true;
	}
	return false;
}

bt.prototype.get_grade = function(value) {
	switch (parseInt(value)) {
		case 7:
			return '七年级';
		case 8:
			return '八年级';
		case 9:
			return '九年级';
		default:
			return '年级';
	}
}

bt.prototype.mobile_regex = function(phone) {
	var phoneReg = /(^1[3|4|5|6|7|8]\d{9}$)|(^09\d{8}$)/;
	if (!phoneReg.test(phone.trim())) {
		return false;
	}
	return true;
}

bt.prototype.clone = function(obj) {
	let o;
	if (typeof obj == "object") {
		if (obj === null) {
			o = null;
		} else {
			if (obj instanceof Array) {
				o = [];
				for (var i = 0, len = obj.length; i < len; i++) {
					o.push(this.clone(obj[i]));
				}
			} else {
				o = {};
				for (var j in obj) {
					o[j] = this.clone(obj[j]);
				}
			}
		}
	} else {
		o = obj;
	}
	return o;
}

bt.prototype.bar_title = function(title) {
	wx.setNavigationBarTitle({
		title: title
	});
}

bt.prototype.network = function(argument) {
	wx.getNetworkType({
		success: res => {
			var networkType = res.networkType
			if (networkType == 'none') {
				this.show('错误', '检测到当前没有任何网络环境~');
			}
		}
	});
	wx.onNetworkStatusChange(res => {
		if (!res.isConnected) {
			this.show('错误', '检测到当前没有任何网络环境~');
		}
	})
}

bt.prototype.load = function(title) {
	wx.showLoading({
		title: `${title}...`,
		mask: true
	});
}

bt.prototype.load_hide = function() {
	wx.hideLoading();
}

// 生成随机数
bt.prototype.random = function(num = 15) {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	for (var i = 0; i < num; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

bt.prototype.arrayInfo = function(data, key, value) {
	let info = data.find(info => {
		return info[key] = value;
	});
	return info;
}

global.bt = new bt();
module.exports = new bt();