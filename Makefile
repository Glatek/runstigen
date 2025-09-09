build_deps:
	npx esbuild --bundle --loader:.png=file --minify --outdir=dist/libs --platform=browser --format=esm src/libs/*.js

build_js:
	npx esbuild --minify --outdir=dist --platform=browser --format=esm src/*.js src/components/*.js

build_css:
	npx esbuild --minify --outdir=dist src/*.css src/components/*.css

build_service_worker:
	npx workbox generateSW workbox-config.cjs

build: clean build_parallel build_service_worker

build_parallel: build_deps build_js build_css

.PHONY: build build_parallel build_deps build_js build_css build_service_worker clean serve

serve:
	npx http-server . -p 1337

clean:
	rm -rf dist
	mkdir -p dist
