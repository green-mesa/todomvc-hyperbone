var View = require('hyperbone-view').HyperboneView;
var Model = require('hyperbone-model').Model;
window.dom = require('dom');

/*
 * Add an extensions to hyperbone view. First pluralise.
 */

require('hyperbone-view').registerHelper('pluralise', function( attr, str ){
	return (attr==1 ? str : str + "s");
});
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

	delegates : { // one delegate, just to capture keypress.
		'keypress #new-todo' : function(e){
			if(e.which===13){
				model.get('items').add({
					completed : "",
					task : dom('#new-todo').val()
				});

				dom('#new-todo').val("");
			}
		}

	}

});

/*
  Insert business logic here.
*/

model
	.on('toggle-all', function(model, val){

		model.get('items').each(function(item){

			item.set('completed', (item.get('completed') ? '' : 'completed'));

		});

	})
	.on('clear-completed', function(){

		/*
		 * We can't destroy elements without disrupting the iterator
		 * So we'll make an array of functions instead..
		 */

		var events = [];

		model.get('items').each(function(item){

			if(item.get('completed')){

				events.push(function(){
					item.destroy();
				});
			}

		});

		/*
		 * Then run them.
		 */ 
		events.forEach(function(fn){
			fn();
		})
		

	})
	.on('filters-changed:filters', function( filter ){
		/*
		 * When an hb-trigger event is fired
		 */

		model.get('filters').each(function(filter){

			if(filter.get('selected')){ 
				filter.set('selected', ''); 
			};

		});

		filter.set('selected', 'selected');

	})
	.on('add:items change:items', function( toDoModel ){

		// update completed/remaining
		model.set('remaining', model
								.get('items')
								.select(function(el){ 
									return !el.get('completed')
								})
								.length);
		model.set('completed', model
								.get('items')
								.select(function(el){ 
									return el.get('completed')
								})
								.length);

	});



