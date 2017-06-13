'use strict';
const {getSuiteTable} = require('./suite');

const {types, applySnapshot, onSnapshot} = require("mobx-state-tree");
const {observable} = require("mobx");


function generateObj(fieldsCount, type){
	const result = {};
	for (let i=0; i< fieldsCount; i++){
		result['val_'+i] = type();
	} 
	return result;
}

let FIELDS_COUNT = 50;
const MstFat = types.model("MstFat", generateObj(FIELDS_COUNT, () => types.maybe(types.number)));

let mstFat = MstFat.create({});

const mutable = require('mutable');
const MuFat = mutable.define('MuFat', {spec:(c)=>{
	return generateObj(FIELDS_COUNT, () => mutable.Number.nullable().withDefault(null));
}});

let muFat = new MuFat();


// console.log(JSON.stringify(makelist(0)));

// example of a benchtable test
getSuiteTable('a fat, flat object')
// add functions
	.addFunction('MST#applySnapshot()', function (s) {
		applySnapshot(mstFat, s);
	}, {
		onCycle(){
			mstFat = MstFat.create({});
		}
	})
	.addFunction('MST#create()', function (s) {
		MstFat.create(s);
	})
	.addFunction('mutable#setValueDeep()', function (s) {
		muFat.setValueDeep(s);
	}, {
		onCycle(){
			muFat = new MuFat();
		}
	})
	.addFunction('mutable#constructor', function (s) {
		new MuFat(s);
	})
	.addFunction('mobx#observable.object()', function (s) {
		observable.object(s);
	})
	.addFunction('mobx#observable.box()', function (s) {
		observable.box(s);
	})
	// add inputs
	.addInput('empty obj', [generateObj(0, Math.random)])
	.addInput('short obj', [generateObj(3, Math.random)])
	.addInput('Long obj', [generateObj(10, Math.random)])
	.addInput('Very fat obj', [generateObj(31, Math.random)])
	.addInput('Fat like it should be', [generateObj(FIELDS_COUNT, Math.random)])
	.addInput('Extremely fat obj', [generateObj(100, Math.random)])
	// spin it!
	.run();
