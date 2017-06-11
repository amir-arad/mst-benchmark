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


const MstNode = types.model("MstNode", {
	value: types.number,
	next: types.maybe(types.late(() => MstNode)),
});

const MstHead = types.model("Head", {
	next: types.maybe(MstNode)
});

// create an instance from a snapshot
let mstHead = MstHead.create({});

const mutable = require('mutable');
const MuNode = mutable.define('MuNode', {spec:(c)=>{
	return {
		value:mutable.Number,
			next:c.nullable().withDefault(null)
	};
}});
MuNode._spec.next = MuNode.nullable().withDefault(null);
const MuHead = mutable.define('MuHead', {spec:(c)=>({
	next:MuNode.nullable().withDefault(null)
})});
let muHead = new MuHead();

//
// // listen to new snapshots
// onSnapshot(store, (snapshot) => {
// 	console.dir(snapshot)
// })
//
// // invoke action that modifies the tree
// store.todos[0].toggle()
// // prints: `{ todos: [{ title: "Get coffee", done: true }]}`

function makelist(length) {
	const result = {};
	Array.from({length}, (v, k) => k + 1).reduce((tail, value) => tail.next = {value}, result);
	return result;
}

// console.log(JSON.stringify(makelist(0)));

// example of a benchtable test
getSuiteTable('wrappers')
// add functions
	.addFunction('MST#applySnapshot()', function (s) {
		applySnapshot(mstHead, s);
	}, {
		onCycle(){
			mstHead = MstHead.create({});
		}
	})
	.addFunction('mutable#setValueDeep()', function (s) {
		muHead.setValueDeep(s);
	}, {
		onCycle(){
			muHead = new MuHead();
		}
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
