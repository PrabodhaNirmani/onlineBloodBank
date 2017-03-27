var assert = require('chai').assert;

var checkDonationTime=require('../testClasses/checkDonationTime');

describe('DonationDate', function() {
  
    it('Return new donation date validity', function() {
    	assert.equal(checkDonationTime(new Date('2016-03-31'),new Date('2016-08-20')),true);
    });

    
  
});
