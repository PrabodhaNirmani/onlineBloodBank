var assert = require('chai').assert;

var bloodExpirationDate=require('../testClasses/bloodExpirationDate');

describe('BloodExpiration', function() {
  
    it('Return expiration date of blood packet', function() {
    	assert.equal(bloodExpirationDate(new Date('October 12, 2016')),true);
    	//assert.equal(bloodExpirationDate(new Date('October 12, 2016')),new Date('November 12, 2016'));
    });

    
  
});
