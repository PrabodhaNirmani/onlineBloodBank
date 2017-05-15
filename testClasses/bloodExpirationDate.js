module.exports=function(donatedDate) {
	// function to test donation duration
	
	var expirationDate=donatedDate;
	var month=donatedDate.getMonth()+1;
	expirationDate.setMonth(month);
	return true;
	// return expirationDate;
	
}
