
const Benchtable = require('benchtable');

exports.getSuiteTable = function getSuiteTable(testName) {
	let suiteTable;

	// enabling benchtable suite

	suiteTable = new Benchtable(testName, {isTransposed: true});

	suiteTable.on('start', function () {
		console.log('Starting benchmarks.');
	});

	suiteTable.on('cycle', function (event) {
		if (!event.target.error) {
	//		console.log(String(event.target));
		}
	});

	suiteTable.on('error', function (event) {
		console.error(String(event.target) + String(event.target.error));
	});

	suiteTable.on('complete', function (event) {
		// console.warn('Fastest is ' + this.filter('fastest')[0].name);
		console.log(this.table.toString());
	});

	return suiteTable;
};
//
// exports.getSuite = function getSuite(config){
// 	const result = getSuiteTable(config.name);
// 	for (let i = 0; i< config.functions.length; i++){
// 		const funcData = config.functions[i];
// 		result.addFunction(funcData.name, funcData.body, funcData.options || {});
// 	}
// 	result
// 		.addInput('empty list', [config.makeData(0)])
// 		.addInput('short list', [config.makeData(3)])
// 		.addInput('Long list', [config.makeData(10)])
// 		.addInput('Very long list', [config.makeData(31)])
// 		.addInput('Extremely long list', [config.makeData(100)]);
// 	return result
// };
