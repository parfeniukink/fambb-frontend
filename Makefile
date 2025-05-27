.PHONY: run
run:
	pnpm run dev

.PHONY: build
build:
	pnpm run build

.PHONY: live
live:
	pnpm run preview --host

.PHONY: install 
install:
	pnpm install -D

.PHONY: check 
check:
	prettier .

.PHONY: format 
format:
	prettier --write .

.PHONY: clean 
clean:
	rm -rf node_modules .svelte-kit
