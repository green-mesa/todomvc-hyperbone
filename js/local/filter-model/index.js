// Our filter model. Has methods for selecting and deselecting it.
module.exports.Filter = require('hyperbone-model').Model.extend({

	defaults : {
		selected : false
	},
	makeActive : function(){
		this.set('selected', true);
	},
	makeInactive : function(){
		if(this.get('selected')){
			this.set('selected', false);
		}
	}
	
});