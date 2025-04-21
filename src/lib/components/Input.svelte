<script lang="ts">
  let {
    value = $bindable(),
    placeholder,
  }: { value: any; placeholder: string } = $props()
</script>

<input
  type="text"
  inputmode="text"
  bind:value
  {placeholder}
  class="px-8 py-3 outline-none border-3 rounded-md w-full"
/>
