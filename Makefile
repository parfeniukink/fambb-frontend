.PHONY: run
run:
	pnpm run dev --host

.PHONY: install 
install:
	pnpm install

.PHONY: format 
format:
	prettier --write .

.PHONY: clean 
clean:
	rm -rf node_modules .svelte-kit
