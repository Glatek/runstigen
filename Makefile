# Find all source files
SRC_JS := $(wildcard src/*.js) $(wildcard src/components/*.js)
SRC_CSS := $(wildcard src/*.css) $(wildcard src/components/*.css)
SRC_LIBS := $(wildcard src/libs/*.js)

build_deps: $(SRC_LIBS)
	npx esbuild --bundle --loader:.png=file --minify --outdir=dist/libs --platform=browser --format=esm src/libs/*.js

build_js: $(SRC_JS)
	npx esbuild --minify --outdir=dist --platform=browser --format=esm src/*.js src/components/*.js

build_css: $(SRC_CSS)
	npx esbuild --minify --outdir=dist src/*.css src/components/*.css

build_service_worker: workbox-config.cjs
	npx workbox generateSW workbox-config.cjs

build: clean build_parallel build_service_worker

build_no_clean: build_parallel build_service_worker

build_parallel: build_deps build_js build_css

.PHONY: build build_no_clean build_parallel build_deps build_js build_css build_service_worker clean serve watch

serve:
	npx http-server . -p 1337

watch:
	@echo "Watching for changes in src/ directory..."
	@echo "Press Ctrl+C to stop"
	@while inotifywait -e modify,create,delete -r src/ workbox-config.cjs; do \
		echo "File change detected, rebuilding..."; \
		make -j4 build_no_clean; \
		echo "Build complete. Watching for changes..."; \
	done

clean:
	rm -rf dist
	mkdir -p dist
