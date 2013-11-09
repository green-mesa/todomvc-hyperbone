/*
 *  We want to extend HyperboneView to support various features in TodoMVC. 
 */

var View = require('hyperbone-view');
var dom  = require('dom');

/*
 * View on its own doesn't have everything it needs.
 *
 * We want to add a 'pluralise' helper, an 'if' helper and a custom attribute
 * to mess with the dom for the dblclick to edit functionality. 
 */

View.use({
	// template helpers are functions within {{}}
	templateHelpers : {
		'pluralise' : function(attr, str){
			return (attr===1 ? str : str + "s");
		},
		'if' : function(attr, str){
			return (attr ? str : '');
		}
	},
	// attribute handlers are handlers for attributes :)
	attributeHandlers : {
		'dblclicktoedit' : function(node, prop, cancel){
			// find our label and input
			var self = this;
			var label = dom(node).find('label');
			var input = dom(node).find('input.edit');
			// bind to dblclick
			label.on('dblclick', function(){
				// and set the user set property
				self.model.trigger(prop, self.model, true);
				input.els[0].focus();

			});

			input
				.on('keypress', function(e){
					if (e.which == 13){
						self.model.trigger(prop, self.model, false);
					}
				})
				.on('blur', function(){
					self.model.trigger(prop, self.model, false);
				});
		}
	}
 });

/*
 * And now we export a reference to our extended view 
 */

module.exports = View.HyperboneView;