var ToDoApplication = function(){

	var model = require('model');

	var view = new (require('view'))({
		model : model, 
		el : '#todoapp', 
	});

	model
		.on('change:new-task', function(){

			var task = model.get('new-task');
			if(task){
				model.get('items').add({
					completed : false,
					task : task
				});
				model.set('new-task', '');
			}

		})
		.on('toggle-all', function(model, val){

			model.get('items').each(function(item){
				item.set('completed', (item.get('completed') ? '' : 'completed'));
			});

		})
		.on('clear-completed', function(){

			var destroyers = [];
			model.get('items').each(function(item){
				if(item.get('completed')){
					destroyers.push(function(){
						item.destroy();
					});
				}
			});
			destroyers.forEach(function(fn){ fn(); })

		})
		.on('filters-changed:filters', function( filter ){

			model.get('filters').each(function(filter){
				if(filter.get('selected')){ 
					filter.set('selected', ''); 
				};
			});


			filter.set('selected', 'selected');

		})
		.on('remove:items change:items', function( toDoModel ){

			var length = model.get('items').length;
			var completed = model
				.get('items')
				.select(function(el){ 
					return el.get('completed')
				})
				.length;

			model.set('completed', completed);
			model.set('remaining', length - completed);
			model.set('has-items', length ? true : false);

		});

}

module.exports = ToDoApplication;


