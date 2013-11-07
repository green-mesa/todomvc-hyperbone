var View = require('hyperbone-view').HyperboneView;
var Model = require('hyperbone-model').Model;
var dom = require('dom');

require('hyperbone-view').registerHelper('pluralise', function( attr, str ){
	return (attr==1 ? str : str + "s");
});

require('hyperbone-view').registerAttributeHandler('if', function( node, prop, cancel ){

	var self = this;

	var test = function(){
		if(self.model.get(prop)){
			dom(node).css({display: ''})			
		}else{
			dom(node).css({display: 'none'});
		}
	}

	this.model.on('change:' + prop, function(){

		test();

	});

	test();

})

var html = dom('#todoapp');

var model = new Model({
	remaining : 0,
	completed : 0,
	items : [
	{
		completed : "completed",
		task : "Something"
	}
	]
});

new View({
	model : model,
	el : html.els[0],
	delegates : {
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

model.get('items').on('change add remove', function(){

	model.set('remaining', model.get('items').select(function(el){ return !el.get('completed')}).length);
	model.set('completed', model.get('items').select(function(el){ return el.get('completed')}).length);

});