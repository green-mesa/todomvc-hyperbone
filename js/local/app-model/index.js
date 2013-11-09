
// Things that manipulate the model live here...
var App = require('hyperbone-model').Model.extend({

	// Specify specific models to use for embedded collections
	_prototypes : {
		"items" : require('todo-model').ToDoItem,
		"filters" : require('filter-model').Filter
	},

	// some default values
	defaults : {
		remaining : 0,
		completed : 0,
		"has-items" : false,
		items : [],
		filters : [
			{
				_links : {
					self : {
							href : '/#!/all'
					}
				},
				selected : 'selected',
				description : "All"
			},
			{
				_links : {
					self : {
							href : '/#!/active'
					}
				},
				selected : '',
				description : "Active"
			},
			{
				_links : {
					self : {
							href : '/#!/completed'
					}
				},
				selected : '',
				description : "Completed"
			},
		]
	},
	clearCompleted : function(){
		// create functions to delete completed items
		var destroyers = [];
		this.get('items').each(function(item){
			if(item.get('completed')){
				destroyers.push(function(){
					item.destroy();
				});
			}
		});
		destroyers.forEach(function(fn){ fn(); });
	},
	toggleAll : function(){
		// we just toggle the completed status
		this.get('items').each(function(item){
			item.set('completed', !item.get('completed'));
		});

	},
	addNewItem : function(){
		// add a new item if task isnt ""
		var task = this.get('new-task');
		if (task){
			this.get('items').add({ task : task });
			this.set('new-task', '');
		}
	},
	updateTotals : function(){
		// recalculate totals
		var length = this.get('items').length,
			completed = this
				.get('items')
				.select(function(el){
					return el.get('completed');
				})
				.length;

		this.set('completed', completed);
		this.set('remaining', length - completed);
		this.set('has-items', length ? true : false);
	}

});

module.exports.AppModel = App;