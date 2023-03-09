'use strict';

const fs = require("fs");
const inquirer = require('inquirer');
const fse = require('fs-extra');
const download = require('download-git-repo');
const log = require('../log');
const { spinnerStart } = require('../utils');

const TYPE_VITE_MOBILE = 'vite_mobile'
const TYPE_VITE_PC = 'vite_pc'
const TYPE_VUE_CLI_MOBILE = 'vue_cli_mobile'
const TYPE_VUE_CLI_PC = 'vue_cli_pc'

class InitCommand {
	constructor(argv) {
		if (!argv) {
			throw new Error('参数不能为空！');
		}
		this._argv = argv;
		this.init();
	}

  async init() {
		const localPath = process.cwd();
		// 1、判断当前目录是否为空
		if (!this.ifDirEmpty(localPath)) {
			// 询问是否继续创建
			let ifContinue = (await inquirer.prompt({
				type: 'confirm',
				name: 'ifContinue',
				default: false,
				message: '当前文件夹不为空，是否继续创建项目？',
			})).ifContinue;
			if (!ifContinue) {
				return;
			}
			if (ifContinue) {
				// 给用户做二次确认
				const { confirmDelete } = await inquirer.prompt({
					type: 'confirm',
					name: 'confirmDelete',
					default: false,
					message: '是否确认清空当前目录下的文件？',
				});
				if (confirmDelete) {
					// 清空当前目录
					fse.emptyDirSync(localPath);
				} else {
					return;
				}
			}
		}
		await this.exec()
	}

	async exec() {
		// 1、选择项目类型
    const { type } = await inquirer.prompt({
			type: 'list',
			name: 'type',
			message: '请选择项目类型',
			default: TYPE_VITE_MOBILE,
			choices: [
				{
					name: 'vite 移动端项目',
					value: TYPE_VITE_MOBILE
				},
				{
					name: 'vite 中后台项目',
					value: TYPE_VITE_PC
				},
				{
				  name: 'vue cli 移动端项目',
				  value: TYPE_VUE_CLI_MOBILE,
			  },
				{
				  name: 'vue cli 中后台项目',
				  value: TYPE_VUE_CLI_PC,
			  }
			]
		})
		const template_vite_mobile = 'https://github.com:zhaobao1830/vite-mobile-zb#master';
		const template_vite_pc = 'https://github.com:zhaobao1830/vite-pc-zb#master';
		const template_vue_cli_mobile = 'https://github.com:zhaobao1830/vueclimobilezb#master';
		const template_vue_cli_pc = 'https://github.com:zhaobao1830/vueclipczb#master';
		let TEMPLATE = ''
		if (type === 'vite_mobile') {
			TEMPLATE = template_vite_mobile
		} else if (type === 'vite_pc') {
			TEMPLATE = template_vite_pc
		} else if (type === 'vue_cli_mobile') {
			TEMPLATE = template_vue_cli_mobile
		} else if (type === 'vue_cli_pc') {
			TEMPLATE = template_vue_cli_pc
		}

		// 2、获取项目的基本信息
    const project = await inquirer.prompt([
			{
				type: 'input',
				name: 'version',
				message: `请输入项目版本号`,
				default: '1.0.0',
			},
			{
				type: 'input',
				name: 'description',
				message: `请输入描述信息`,
				default: '',
			}
		])
    if (project) {
			let spinner = spinnerStart('正在下载项目模板...');
			download(TEMPLATE, this._argv, { clone: true }, (err) => {
				spinner.stop(true);
				if (err) {
					log.error('下载项目模板失败，请重新下载！');
				} else {
					const fileName = `${this._argv}/package.json`;
					const meta = {
						name: this._argv,
						version: project.version,
						description: project.description,
					}
					if(fs.existsSync(fileName)){
						const content = fse.readJsonSync(fileName);
						const result = {...content, ...meta};
						fse.writeJSONSync(fileName, result, {
							spaces: 2,
							EOL: '\r\n'
						});
					}
					log.success('项目模板下载成功！');
				}
			})
		}
	}

	// 当前目录是否为空
	ifDirEmpty(localPath) {
		let fileList = fs.readdirSync(localPath);
		fileList = fileList.filter(file => (
			!file.startsWith('.') && ['node_modules'].indexOf(file) < 0
		));
		return !fileList || fileList.length <= 0;
	}

}
function init(argv) {
	return new InitCommand(argv);
}

module.exports = init;
