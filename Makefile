
all: build

build: gulpfile.js
	gulp build && gulp clean

.PHONY: build

