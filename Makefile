.PHONY: help install-hooks hooks-pre-commit hooks-commit-msg hooks-pre-push hooks-post-merge hooks-post-checkout dev build test test-integration smoke lint fmt pages-preview clean

help:
	@printf "Targets:\n"
	@printf "  make install-hooks     Wire local git hooks\n"
	@printf "  make hooks-pre-commit  Run the pre-commit hook\n"
	@printf "  make hooks-pre-push    Run the pre-push hook\n"
	@printf "  make dev               Run the frontend dev server\n"
	@printf "  make build             Build the GitHub Pages site into docs/\n"
	@printf "  make test              Run unit tests\n"
	@printf "  make test-integration  Run integration tests\n"
	@printf "  make smoke             Run the static-site smoke test\n"
	@printf "  make lint              Run linters and type checks\n"
	@printf "  make fmt               Format source files\n"
	@printf "  make pages-preview     Serve docs/ like GitHub Pages\n"
	@printf "  make clean             Remove local build/cache artifacts\n"

install-hooks:
	git config core.hooksPath .githooks

hooks-pre-commit:
	.githooks/pre-commit

hooks-commit-msg:
	@test -n "$(MSG)" || (printf "Usage: make hooks-commit-msg MSG=.git/COMMIT_EDITMSG\n" && exit 2)
	.githooks/commit-msg "$(MSG)"

hooks-pre-push:
	.githooks/pre-push

hooks-post-merge:
	.githooks/post-merge

hooks-post-checkout:
	.githooks/post-checkout

dev:
	npm run dev

build:
	npm run build

test:
	npm test

test-integration:
	npm run test:integration

smoke:
	npm run smoke

lint:
	npm run lint

fmt:
	npm run fmt

pages-preview:
	rm -rf tmp/pages-preview
	mkdir -p tmp/pages-preview
	ln -s "$$(pwd)/docs" tmp/pages-preview/group-theory-visualizer
	npx http-server tmp/pages-preview -p 4173 -c-1

clean:
	rm -rf node_modules/.vite coverage dist dist-data
