'use strict';
const {getSuiteTable} = require('./suite');
const {types, applySnapshot } = require("mobx-state-tree");
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
