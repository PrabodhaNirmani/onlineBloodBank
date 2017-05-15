var assert = require('chai').assert;

var addStaff=require('../testClasses/addStaff');

describe('AddStaff', function() {
  
    it('Check add new staff member funcitonality', function() {
    	assert.equal(addStaff("hirunahans@gmail.com","Hiruna Hansaka","0765564323"),undefined);
    });

    
  
});