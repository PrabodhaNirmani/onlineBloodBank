var assert = require('chai').assert;

var createDonation=require('../testClasses/createDonation');

describe('CreateDonation', function() {
  
    it('Check fucntionality of create new blood donation', function() {
    	assert.equal(createDonation(new Date('October 12, 2016')),true);
    	//assert.equal(bloodExpirationDate(new Date('October 12, 2016')),new Date('November 12, 2016'));
    });

    
  
});
