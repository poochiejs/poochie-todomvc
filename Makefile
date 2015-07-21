all: js/app.js

files = $(filter-out %test.js,$(wildcard *.js))

node_modules/.exists:
	npm install
	@touch $@

js/app.js: $(files) node_modules/.exists
	@mkdir -p $(@D)
	browserify $(addprefix -r ./,$(files)) -r poochie/dom -o $@ || rm -f $@

clean:
	rm -f js/app.js
	rm -rf node_modules
