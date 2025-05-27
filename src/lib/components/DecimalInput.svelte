<script lang="ts">
  let {
    value = $bindable(),
    inputmode = "decimal",
    placeholder,
  }: {
    value: any
    placeholder: string
    inputmode?: "decimal" | "numeric"
  } = $props()

  function sanitizeDecimal(input: string): number {
    const result = input
      .replace(" ", "")
      .replace(/[^0-9.,]+/g, "")
      .replace(",", ".")
    return Number(result)
  }
</script>

<input
  type="text"
  inputmode={inputmode ?? "decimal"}
  pattern="\d*"
  bind:value
  {placeholder}
  class="px-8 py-3 outline-none border-3 rounded-md w-full"
  onchange={(event: Event & { currentTarget: HTMLInputElement }) => {
    if (value !== null) {
      const inputValue = event.currentTarget.value
      value = sanitizeDecimal(inputValue)
      event.currentTarget.value = value
    }
  }}
/>
