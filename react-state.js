'use strict';

const {getSuiteTable} = require('./suite');

const {types, applySnapshot} = require("mobx-state-tree");
const {observable} = require("mobx");
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const createReactClass = require('create-react-class');
const {observer} = require('mobx-react/custom');

const MstState = types.model("MstState", {
	f1: types.boolean,
	f2: types.boolean,
});

let nativeState = {f1:false, f2:false};

const mutable = require('mutable');
const MuState = mutable.define('MuState', {spec:(c)=>{
	return {
		f1:mutable.Boolean,
		f2:mutable.Boolean,
	};
}});


function render(){
	return React.createElement('div', null, JSON.stringify(this.state));
}

function range(length){
	return Array.from({length}, (v, k) => ''+k)
}

function makeFunction(getInitialState, isMobx){
	let component = createReactClass({
		getInitialState,
		render
	});
	if (isMobx){
		component = observer(component)
	}
	return function (range) {
		ReactDOMServer.renderToStaticMarkup(React.createElement(
			'div',
			null,
			range.map(i => React.createElement(component, {key:i}, null))
		))
	};
}
// example of a benchtable test
getSuiteTable('react state solutions')
// add functions

	.addFunction('empty pure component', makeFunction(()=>null))
	.addFunction('vanilla component', makeFunction(()=>nativeState))
	.addFunction('mst component', makeFunction(()=>MstState.create(nativeState), true))
	.addFunction('mutable component', makeFunction(()=>new MuState(nativeState), true))
	.addFunction('mobx component', makeFunction(()=>observable.box(nativeState), true))

	// add inputs
	.addInput('0', [range(0)])
	.addInput('3', [range(3)])
	.addInput('10', [range(10)])
	.addInput('31', [range(31)])
	.addInput('100', [range(100)])
	.addInput('316', [range(316)])
	.addInput('1000', [range(1000)])
	// spin it!
	.run();
