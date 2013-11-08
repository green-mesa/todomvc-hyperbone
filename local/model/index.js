var Model = require('hyperbone-model').Model;

module.exports = new Model({
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