<script lang="ts">
  let {
    checked = $bindable(),
    onchangeCallback,
  }: {
    checked: any
    onchangeCallback?: CallableFunction
  } = $props()
</script>

<input
  type="checkbox"
  bind:checked
  onchange={(e) => {
    if (onchangeCallback) {
      onchangeCallback()
    }
  }}
/>
