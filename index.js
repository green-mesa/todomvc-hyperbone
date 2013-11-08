
var View = require('view');
var Model = require('hyperbone-model').Model;
var dom = require('dom');

/*
 * Add an extensions to hyperbone view. First pluralise.
 */

/*
 * Create a model with one default item already in it.
 */


window.model = new Model({
	_links : {
		self : {
			href : "/"
		}
	},
	remaining : 0,
	completed : 0,
	"has-items" : false,
	items : [
	],
	_embedded : {
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
	}
});

/*
  Create our view...
*/

new View({

	model : model, // our model

	el : dom('#todoapp'), // a reference to our application root.

});

/*
	Make it visible.
*/

/*
  Insert business logic here.
*/

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

		var events = [];

		model.get('items').each(function(item){

			if(item.get('completed')){
				events.push(function(){
					item.destroy();
				});
			}
		});

		events.forEach(function(fn){
			fn();
		})

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

