var ToDoApplication = function(){

	// get our model...
	var model = require('model');

	// create our view. Note that 
	// we're not calling Hyperbone View directly.
	// We've extended it with a custom handler to support
	// the dblclick to edit functionality. We call the 
	// extended version here.
	var view = new (require('view'))({

		model : model, 
		el : '#todoapp', // a reference to our application root.

	});

	// Generate our business logic through Hyperbone events.

	// Note that we never touch the DOM here. Any monkeying around with the DOM
	// that absolutely cannot be avoided should be done as an extension to View. 

	model
		.on('change:new-task', function(){

			// we bound the create new task box
			// to new-task. When this changes
			// this event fires.

			var task = model.get('new-task');

			// we don't want to create an empty task..
			if(task){

				// task items are stored in items, which
				// is a collection. We add our new 
				// model. 
				model.get('items').add({
					completed : false,
					task : task
				});

				// and we reset new-task back to an empty string
				model.set('new-task', '');
			}

		})
		.on('toggle-all', function(model, val){

			// we added an hb-trigger to the toggle all button
			// so this events fires when that happens.

			// Here we just quickly toggle the 'completed' status.
			model.get('items').each(function(item){

				item.set('completed', (item.get('completed') ? '' : 'completed'));

			});

		})
		.on('clear-completed', function(){

			// we added an hb-trigger to the 'clear completed' button
			// so this event fires when the user clicks it.

			// we create an empty array to hold our 'destroy this'
			// functions. You can't destroy models within a collection
			// while you're iterating through the collection.
			var destroyers = [];

			// get our items collection and iterate...
			model.get('items').each(function(item){

				// if it's 'completed' we add a function to destroy the 
				// item to our 
				if(item.get('completed')){
					destroyers.push(function(){
						item.destroy();
					});
				}
			});

			// and now we have a safe array we can iterate 
			// through to call all our destroyers.
			destroyers.forEach(function(fn){ fn(); })

		})
		.on('filters-changed:filters', function( filter ){

			/*

				So this bit is the most alien so i'm going to explain this one in more
				depth.

				This is what we did in the HTML:

				<ul id="filters" hb-with="filters">
					<li>
						<a class="{{selected}}" rel="self" hb-trigger="filters-changed">{{description}}</a>
					</li>
				</ul>

				Note that we've used 'hb-with' and pointed it at a collection, 'filters'.
				
				HyperboneView will then regard any childNodes as a template. From this
				template it creates a brand new view for each item in the collection. The new 
				view is bound to the collection item, not the parent model. 

				Within the li we have a call to 'hb-trigger'. When a user clicks an element with an
				hb-trigger, the correct event is fired, and the view passes a reference to its model.

				Technically speaking the event 'filters-changed' only fires on the individual model within
				the collection. This then bubbles up to the parent model and becomes
				'filters-changed:filters'. This is the event we want to subscribe to. 

				So, in this case, when a user clicks a filter link, 'filters-changed:filters' is fired
				and it is passed the individual filter model - the filter model bound to the view that 
				contains the link that was clicked. 

			*/

			// find the currently selected filter...
			model.get('filters').each(function(filter){

				// and deactivate it...
				if(filter.get('selected')){ 
					filter.set('selected', ''); 
				};

			});

			// then set our new filter to selected.
			filter.set('selected', 'selected');

		})
		.on('remove:items change:items', function( toDoModel ){

			/*

				Again all changes to collections bubble up to the parent model 
				as 'event:collection'. This gives us a reliable set of signals
				to subscribe to. remove:items and change:items means this fires
				whenever something is added, removed or there's a change to 
				an individual item, i.e, marked as completed etc.

			*/

			// What we're doing here is populating the
			// completed/remaining counts and setting
			// a flag that states whether or not we 
			// have any items. This is to comply with 
			// the spec that requires the filter box to 
			// disappear when there's no items.

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


