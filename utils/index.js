// 封装node cli节点旋转效果
function spinnerStart(msg, spinnerString = '|/-\\') {
	const Spinner = require('cli-spinner').Spinner;
	const spinner = new Spinner(msg + ' %s');
	spinner.setSpinnerString(spinnerString);
	spinner.start();
	return spinner;
}

module.exports = {
	spinnerStart
}
