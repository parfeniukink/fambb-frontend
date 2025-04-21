<script lang="ts">
  let {
    value = $bindable(),
    placeholder,
  }: { value: any; placeholder: string } = $props()

  function sanitizeDecimal(input: string): number {
    const result = input
      .replace(" ", "")
      .replace(/[^1-9.,]+/g, "")
      .replace(",", ".")
    console.log(result)
    return Number(result)
  }
</script>

<input
  type="text"
  inputmode="decimal"
  pattern="\d*"
  bind:value
  {placeholder}
  class="px-8 py-3 outline-none border-3 rounded-md w-full"
  onchange={(event: Event & { currentTarget: HTMLInputElement }) => {
    console.log(event.target)
    if (value !== null) {
      const inputValue = event.currentTarget.value
      value = sanitizeDecimal(inputValue)
      event.currentTarget.value = value
    }
  }}
/>
