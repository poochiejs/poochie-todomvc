all: js/app.js

files = $(filter-out %test.js,$(wildcard *.js))
testFiles = $(wildcard *test.js)

node_modules/.exists:
	npm install
	@touch $@

js/app.js: $(files) $(testFiles) node_modules/.exists
	npm test
	@mkdir -p $(@D)
	browserify $(addprefix -r ./,$(files)) -r poochie/dom -o $@ || rm -f $@

clean:
	rm -f js/app.js
	rm -rf node_modules

publish: js/app.js
	git show-branch gh-pages && git checkout gh-pages || git checkout --orphan gh-pages && git rm -rf .
	git add $<
	git diff --cached --exit-code || git commit -m "Updated JavaScript" && git push origin gh-pages
	git checkout master
	@echo
	@echo "Published https://garious.github.io/poochie-todomvc"
