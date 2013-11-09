
build: components js/app.js
	@component build && flatinator -n todomvc --app todomvc-hyperbone

components: component.json
	@component install

clean:
	rm -fr build components template.js

.PHONY: clean
