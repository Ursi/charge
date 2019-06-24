export default obj => {
	return function(){
		for (let [name, method] of Object.entries(this)) {
		    Object.defineProperty(obj, name, {value: method, writable: true});
		}
	}
}