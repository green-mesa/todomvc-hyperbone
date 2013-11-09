# Hyperbone TodoMVC Example

> Hyperbone: Backbone for Hypermedia. Bind complex, rich, nested models to the DOM effortlessly.

> _[Todo-MVC, made with Hyperbone](http://charlottegore.com/todomvc/)_


## Learning Hyperbone

Hyperbone is still under development (we decided to build this ToDo app as soon as it seemed like it was possible in order to test the Framework early) so the only documentation is for each module on Github.

Here is a link you may find helpful:

* [Hyperbone on Github](green-mesa.github.io)
 
The way to think about Hyperbone is that it's a bit like Backbone Models with something that's a bit like Angular's view engine.

Hyperbone Models have all the same features that Backbone Models have, except that nested models and collections (supported by dot notation accessors) are built in, along with additional features to support JSON HAL documents and more.

Hyperbone View binds models to the DOM. Element innerText and attributes can be templated, and there are a very small number of custom attributes to support what is absolutely necessary, along with an API for extending and expanding it.


_If you have other helpful links to share, or find any of the links above no longer work, please [let us know](https://github.com/tastejs/todomvc/issues)._


## Implementation

The application begins at app.js. A new instance of App model is created, a new view instance is created and then we bind a bunch of handlers for various events that can be triggered on the model, and these handlers then perform our business logic on the model.

The view engine, being bound to the model, updates automatically.

The main approach is:

- No touching the DOM from inside our application code
- Only subscribe to Hyperbone Events
- Bind inputs in the DOM to particular model attributes
- Use templated innerText and attributes to show model attribute values
- Use a few custom attributes to cause buttons/links to trigger Hyperbone Events
- Use the Hyperbone View extension API for anything else.

The result is that most of the spec has been implemented (excepting Local Storage which isn't relevant to Hyperbone and routing, which hasn't been implemented yet) in only 60k of minified code, and about 25k gzipped - and that includes all dependencies - Backbone, Underscore and various Components for interacting with the DOM

Hyperbone also brings a few peculiarities. It is designed to be installed and built using the Component package manager, so it's CommonJS to begin with. The app is built with Component and then post-processed with another tool to minimise build file sizes but that step is optional. 

## Running

The built version of the app has been included in the repo, so to run run the app, spin up an HTTP server and visit http://localhost.

To install the build tools:

```sh
npm install -g component flatinator
```

To build:
```sh
make
```

## Credit

This TodoMVC application was created by [Charlotte Gore]().
