module.exports=function(birthday) {
	// function to test age calculation of blood donor

	var today=new Date();	//creating date object of today
	var age=today.getYear()-birthday.getYear();
	if(age-18>=01)
		return true;
	else
		return false;
}
