'use strict';

const {getSuiteTable} = require('./suite');

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


function makelist(length) {
	const result = {};
	Array.from({length}, (v, k) => k + 1).reduce((tail, value) => tail.next = {value}, result);
	return result;
}


// example of a benchtable test
getSuiteTable('linked list')
// add functions
	.addFunction('MST#applySnapshot()', function (s) {
		applySnapshot(mstHead, s);
	}, {
		onCycle(){
			mstHead = MstHead.create({});
		}
	})
	.addFunction('MST#create()', function (s) {
		MstHead.create(s);
	})
	.addFunction('mutable#setValueDeep()', function (s) {
		muHead.setValueDeep(s);
	}, {
		onCycle(){
			muHead = new MuHead();
		}
	})
	.addFunction('mutable#constructor', function (s) {
		new MuHead(s);
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
