/*
 *  We want to extend HyperboneView to support various features in TodoMVC. 
 */

var View = require('hyperbone-view');
var dom  = require('dom');

/*
 * Helper to add an s when necessary.
 */

View.registerHelper('pluralise', function( attr, str ){
	return (attr==1 ? str : str + "s");
});

/*
 * Double Click to Edit requires an extension to View because it requires actual DOM tinkering.
 */
View.registerAttributeHandler('dblclicktoedit', function(node, prop, cancel){

	var self = this;
	var label = dom(node).find('label');
	var input = dom(node).find('input.edit');

	label.on('dblclick', function(){

		self.model.set('editing', 'editing');
		input.els[0].focus();

	});

	input.on('keypress', function(e){

		if(e.which===13){
			self.model.set('editing', '');
		}

	});

	input.on('blur', function(e){
		self.model.set('editing', '');
	})

});

/*
 * And now we export a reference to our HyperboneView constructor. 
 */

module.exports = View.HyperboneView;