# TODO:

- Fetch transactions not only for hardcoded currencies
  - `analytics/transactions/+page.svelte::24L`

# FIX:

- Unhandled Promise Rejection: SyntaxError: The string did not match the expected pattern
  - `src/data/requests.ts`. all the DELETE requests raise this error in browser console
