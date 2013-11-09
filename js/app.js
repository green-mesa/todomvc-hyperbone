var ToDoApplication = function(){

	// load in our model
	window.model = new (require('app-model')).AppModel();

	// load our view - a hyperbone view with some custom extensions
	var view = new (require('extended-view'))({
		model : model,
		el : '#todoapp'
	});

	// subscribe to a bunch of Hyperbone Events. Some
	// come from the hb-triggers we've set up in the HTML.
	model.on({
		'change:new-task' : function(){
			model.addNewItem();
		},
		'toggle-all' : function(){
			model.toggleAll();
		},
		'clear-completed' : function(){
			model.clearCompleted();
		},
		'remove:items change:items' : function(){
			model.updateTotals();
		},
		'edit:items' : function( item, flag ){
			item.toggleEdit( flag );
		},
		'filters-changed:filters' : function( filter ){
			model.get('filters').each(function(filter){
				filter.makeInactive();
			});
			filter.makeActive();
		}
	});
};

new ToDoApplication();


