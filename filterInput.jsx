//snippet to filter edittext input for only numbers for example

edittext.onChanging = function(){
	preFilter = /[+-]?([0-9\:\.]*)/; //this one does not allow to input anything but numbers and some symbols;
	this.text = this.text.match(preFilter)[0];
}