var View = require('hyperbone-view').HyperboneView;
var Model = require('hyperbone-model').Model;
window.dom = require('dom');

/*
 * Add some extensions to hyperbone view. First pluralise.
 */

require('hyperbone-view').registerHelper('pluralise', function( attr, str ){
	return (attr==1 ? str : str + "s");
});

/*
 * Then 'if'. Would you believe it there isn't an 'if' directive in hyperbone view yet.
 */

require('hyperbone-view').registerAttributeHandler('if', function( node, prop, cancel ){

	var self = this, 
		test = function(){
			dom(node).css({display: ( self.model.get(prop)!==0 ? '': 'none') });	
		};

	this.model.on('change:' + prop, function(){ test() });
	// do the initial state.
	test();

});

/*
 * Create a model with one default item already in it.
 */

var model = new Model({
	remaining : 0,
	completed : 1,
	items : [
	{
		completed : "completed",
		task : "Something"
	}
	]
});

/*
 * Bind to collection add/remove/change events to update calulations
 */

model.on('list-updated change:items', function(){

	// turns out we don't get a generic 'change' event when a collection has been changed. Only changes
	// this callback never fires...
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

new View({
	model : model, // our model
	el : dom('#todoapp'), // a reference to our application root.
	delegates : { // delegates to capture
		'keypress #new-todo' : function(e){
			if(e.which===13){
				model.get('items').add({
					completed : "",
					task : dom('#new-todo').val()
				});

				model.trigger('list-updated');
				dom('#new-todo').val("");
			}
		},
		'click button.destroy' : function(e, item){

			model.get('items').remove(item);
			model.trigger('list-updated');
			debugger;
		},
		'click #clear-completed' : function(e){
			// this has exposed a bug in the collection handling stuff. If you try to set an existing collection
			// with an array of models... it's maximum call stack time. Shittington.
			var remaining = model.get('items').select(function(el){ return el.get('completed'); })
			model.get('items').remove(remaining);

			model.trigger('list-updated');

		}

	}
});


/*
  
  Bug list:
  - add/remove to a collection is not firing add/remove or change events. Only changing an element of the collection fires
  - delegates need to be actual delegates. Dynamic nodes 

*/
