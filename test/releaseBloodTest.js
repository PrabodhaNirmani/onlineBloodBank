var assert = require('chai').assert;

var releaseBloodPackets=require('../testClasses/releaseBlood');

describe('ReleaseBlood', function() {
  
    it('Check fucntionality of release blood packets', function() {
    	assert.equal(releaseBloodPackets(new Date('October 12, 2016')),true);
    	//assert.equal(bloodExpirationDate(new Date('October 12, 2016')),new Date('November 12, 2016'));
    });

    
  
});
