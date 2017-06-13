'use strict';
const {getSuiteTable} = require('./suite');

const {types, applySnapshot, onSnapshot} = require("mobx-state-tree");
const {observable} = require("mobx");


const MstMap = types.model("MstMap", {
	data: types.map(types.string)
});

// create an instance from a snapshot
let mstMap = MstMap.create({data: {}});

const mutable = require('mutable');

const MuMap = mutable.define('MuMap', {
	spec: (c) => {
		return {
			data: mutable.Map.of(mutable.String),
		};
	}
});

let muMap = new MuMap();

function makeMap(length) {
	return {
		data: Array.from({length}, (v, k) => '' + k)
			.reduce((acc, i) => {
				acc['' + i] = 'val' + i;
				return acc;
			}, {})
	};
}

// console.log(JSON.stringify(makeMap(0)));

// example of a benchtable test
getSuiteTable('map wrappers')
// add functions
	.addFunction('MST#applySnapshot()', function (s) {
		applySnapshot(mstMap, s);
	}, {
		onCycle(){
			mstMap = MstMap.create({data: {}});
		}
	})
	.addFunction('MST#create()', function (s) {
		MstMap.create(s);
	})
	.addFunction('mutable#setValueDeep()', function (s) {
		muMap.setValueDeep(s);
	}, {
		onCycle(){
			muMap = new MuMap();
		}
	})
	.addFunction('mutable#constructor', function (s) {
		new MuMap(s);
	})
	.addFunction('mobx#observable.map() and observable.shallow()', function (s) {
		observable.map(s.data);
		observable.shallow(s);
	})
	// add inputs
	.addInput('empty map', [makeMap(0)])
	.addInput('short map', [makeMap(3)])
	.addInput('Long map', [makeMap(10)])
	.addInput('Very long map', [makeMap(31)])
	.addInput('Extremely long map', [makeMap(100)])
	// spin it!
	.run();
