var assert = require('chai').assert;

var calculateAge=require('../testClasses/calculateAge');

describe('Age', function() {
  
    it('Return age validity', function() {
    	assert.equal(calculateAge(new Date('1994-11-30')),true);
    });

    
  
});
