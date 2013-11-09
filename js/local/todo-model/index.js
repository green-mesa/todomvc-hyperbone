// Our to-do item model
module.exports.ToDoItem = require('hyperbone-model').Model.extend({
	// default values
	defaults : {
		completed : false,
		task : "A task"
	},
	toggleEdit : function( flag ){

		this.set('editing', flag );

	}

});