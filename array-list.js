'use strict';

var Benchmark = require('benchmark').Benchmark,
	Benchtable = require('benchtable');


function getSuite(testName) {
	var suite;

	// enabling benchmark suite

	suite = Benchmark.Suite(testName);

	suite.on('start', function () {
		console.log('Starting benchmarks.');
	});

	suite.on('cycle', function (event) {
		if (!event.target.error) {
			console.log(String(event.target));
		}
	});

	suite.on('error', function (event) {
		console.error(String(event.target) + String(event.target.error));
	});

	suite.on('complete', function (event) {
		console.warn('Fastest is ' + this.filter('fastest')[0].name);
	});

	return suite;
}

function getSuiteTable(testName) {
	var suiteTable;

	// enabling benchtable suite

	suiteTable = new Benchtable(testName, {isTransposed: true});

	suiteTable.on('start', function () {
		console.log('Starting benchmarks.');
	});

	suiteTable.on('cycle', function (event) {
		if (!event.target.error) {
			console.log(String(event.target));
		}
	});

	suiteTable.on('error', function (event) {
		console.error(String(event.target) + String(event.target.error));
	});

	suiteTable.on('complete', function (event) {
		console.warn('Fastest is ' + this.filter('fastest')[0].name);
		console.log(this.table.toString());
	});

	return suiteTable;
}

//
// // example of a benchmark test
// getSuite('suite one')
// // add cases
// 	.add('concat', function () {
// 		var b = 'foo' + 'bar';
// 	})
// 	.add('array join', function () {
// 		var b = ['foo', 'bar'].join('');
// 	})
// 	// spin it
// 	.run();

const {types, applySnapshot, onSnapshot} = require("mobx-state-tree");
const {observable} = require("mobx");


const MstArr = types.model("MstArr", {
	data: types.array(types.string)
});

// create an instance from a snapshot
let mstArr = MstArr.create({data:[]});

const mutable = require('mutable');

const MuArr = mutable.define('MuArr', {spec:(c)=>{
	return {
		data:mutable.List.of(mutable.String),
	};
}});

let muArr = new MuArr();

function makelist(length) {
	return {data:Array.from({length}, (v, k) => ''+k)};
}

// console.log(JSON.stringify(makelist(0)));

// example of a benchtable test
getSuiteTable('array wrappers')
// add functions
	.addFunction('MST#applySnapshot()', function (s) {
		applySnapshot(mstArr, s);
	}, {
		onCycle(){
			mstArr = MstArr.create({data:[]});
		}
	})
	.addFunction('MST#create()', function (s) {
		MstArr.create(s);
	})
	.addFunction('mutable#setValueDeep()', function (s) {
		muArr.setValueDeep(s);
	}, {
		onCycle(){
			muArr = new MuArr();
		}
	})
	.addFunction('mutable#constructor', function (s) {
		new MuArr(s);
	})
	.addFunction('mobx#observable.object()', function (s) {
		observable.object(s);
	})
	.addFunction('mobx#observable.box()', function (s) {
		observable.box(s);
	})
	// add inputs
	.addInput('empty list', [makelist(0)])
	.addInput('short list', [makelist(3)])
	.addInput('Long list', [makelist(10)])
	.addInput('Very long list', [makelist(31)])
	.addInput('Extremely long list', [makelist(100)])
	// spin it!
	.run();
