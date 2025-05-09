<script lang="ts">
  let {
    value = $bindable(),
    type = "text",
    placeholder,
    styles,
  }: {
    value: any
    type?: string
    styles?: string
    placeholder: string
  } = $props()
</script>

<input
  type={`${type}`}
  inputmode="text"
  bind:value
  {placeholder}
  class={styles ? styles : "px-8 py-3 outline-none border-3 rounded-md w-full"}
/>
