var assert = require('chai').assert;

var registerBloodDonor=require('../testClasses/registerDonor');

describe('RegisterDonor', function() {
  
    it('Check fucntionality of register new blood donor', function() {
    	assert.equal(registerBloodDonor(new Date('October 12, 2016')),true);
    	//assert.equal(bloodExpirationDate(new Date('October 12, 2016')),new Date('November 12, 2016'));
    });

    
  
});
