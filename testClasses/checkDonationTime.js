module.exports=function(oldDate,newDate) {
	// function to test donation duration
	
	if(oldDate==null){
		return true;
	}
	else if(newDate.getYear()-oldDate.getYear()>0){
		return true;
	}
	else if(newDate.getYear()-oldDate.getYear()==0 && newDate.getMonth()-oldDate.getMonth()>4){
		return true;
	}
	else if(newDate.getYear()-oldDate.getYear()==0 && newDate.getMonth()-oldDate.getMonth()==4 && newDate.getDate()-oldDate.getDate()>0){
		return true;
	}
	else{
		return false;
	}

	
}
