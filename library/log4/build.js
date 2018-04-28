const log4js = require('log4js');
const path = require('path');

console.log(path.resolve('./logs/'))

log4js.configure({
	appenders: {
		cheese: {
			type: 'dateFile',
			filename: 'logs/',//您要写入日志文件的路径
			pattern: "yyyy-MM-dd-hh.log",//（可选，默认为.yyyy-MM-dd） - 用于确定何时滚动日志的模式。格式:.yyyy-MM-dd-hh:mm:ss.log
			maxLogSize: 1024,//文件最大存储空间，当文件内容超过文件存储空间会自动生成一个文件xxx.log.1的序列自增长的文件
			alwaysIncludePattern: true,（默认为false） - 将模式包含在当前日志文件的名称以及备份中
			backups: 4,
			category: 'normal',
			encoding: 'utf-8',//default "utf-8"，文件的编码
		}
	},
	categories: {
		default: {
			appenders: ['cheese'],
			level: 'error'
		}
	}
});

const logger = log4js.getLogger();
logger.level = 'info';

global.log = logger;