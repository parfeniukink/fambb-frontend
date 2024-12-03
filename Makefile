.PHONY: run
run:
	pnpm run dev --host

.PHONY: install 
install:
	pnpm install

.PHONY: clean 
clean:
	rm -rf node_modules .svelte-kit
