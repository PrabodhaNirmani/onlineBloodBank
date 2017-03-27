var assert = require('chai').assert;

var first=require('../testClasses/first');

describe('First', function() {
  
    it('Return hello', function() {
      assert.equal(first(),"hello");
    });
  
});
