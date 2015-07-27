o = out
nodeBin = node_modules/.bin

shipFiles = \
    app.js \
    index.html \
    todomvc-common/base.css \
    todomvc-app-css/index.css

files = $(filter-out %test.js,$(wildcard *.js))
testFiles = $(wildcard *test.js)

all: $(addprefix $o/,$(shipFiles))

node_modules/.exists: package.json
	npm install
	@touch $@

$o/app.js: $(files) $(testFiles) node_modules/.exists
	@mkdir -p $(@D)
	npm test
	@mkdir -p $(@D)
	$(nodeBin)/browserify $(addprefix -r ./,$(files)) -r poochie/dom -o $@ || rm -f $@

$o/index.html: index.html
	@mkdir -p $(@D)
	cp $< $@

$o/%: node_modules/%
	@mkdir -p $(@D)
	cp $< $@

clean:
	rm -rf $o
	rm -rf node_modules

publish: all
	git show-branch gh-pages && git checkout gh-pages || git checkout --orphan gh-pages && git rm -rf .
	mv $o/* .
	git add .
	git diff --cached --exit-code || git commit -m "Updated JavaScript" && git push origin gh-pages
	git checkout master
	@echo
	@echo "Published https://garious.github.io/poochie-todomvc"
