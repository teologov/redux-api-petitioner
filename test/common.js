'use strict';

global.sinon = require('sinon');
global.chai = require('chai');
global.expect = global.chai.expect;
global.assert = global.chai.assert;

require('babel-register')({
  ignore: filename => /node_modules/.test(filename)
})