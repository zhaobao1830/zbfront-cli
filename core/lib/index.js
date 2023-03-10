'use strict';

// commander注册命令
const commander = require('commander');
const pkg = require('../../package.json')

const init = require('../../init');

// 手动实例化一个command实例
const program = new commander.Command();

function core() {
  program
		.name('zbfront-cli')
		.usage('<command> [options]')
		.version(pkg.version)
		.option('-d, --debug', '是否开启调试模式', false)

	/**
	 * 注册init指令，执行init方法
	 * @param projectName 项目名称
	 */
	program
		.command('init [projectName]')
		.action(init);

	program
		.parse(process.argv);
}

module.exports = core;
