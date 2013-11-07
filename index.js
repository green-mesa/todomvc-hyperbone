var View = require('hyperbone-view').HyperboneView;
var Model = require('hyperbone-model').Model;
var dom = require('dom');

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

	this.model.on('change:' + prop, function(){
		debugger;
		test();

	});

	test();

});

/*
 * Create a model with one default item already in it.
 */

window.model = new Model({
	remaining : 0,
	completed : 1,
	"new-item" : "",
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

model.on('change:items', function(){

	// turns out we don't get a generic 'change' event when a collection has been changed. BUG!
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

model.on('change:new-item', function(){

	var val = model.get('new-item');

	if(val!=""){
		model.get('items').add({
			completed : "",
			task : model.get('new-item')
		});
		model.set('new-item', '');
	}

});

new View({
	model : model, // our model
	el : dom('#todoapp'), // a reference to our application root.
	delegates : { // delegates to capture 
		'keypress #new-todo' : function(e){
			if(e.which===13){

			}
		},
		'click #clear-completed' : function(e){
			// this has exposed a bug in the collection handling stuff. If you try to set an existing collection
			// with an array of models... it's maximum call stack time. Shittington.
			var remaining = model.get('items').select(function(el){ return !el.get('completed'); })
			model.get('items').remove(remaining);
		}
	}
});

