<script lang="ts">
  let {
    children,
    title,
    width = 64,
    border = 3,
  }: {
    children: CallableFunction
    title: string
    width?: number
    border?: number
  } = $props()

  const stylesMapping: Record<string, Record<string, string>> = {
    width: {
      64: "w-64",
      76: "w-76",
      100: "w-100",
      120: "w-120",
    },
    border: {
      1: "border-1",
      2: "border-2",
      3: "border-3",
      4: "border-4",
    },
  }
</script>

<main
  class={`flex flex-col gap-10 p-8 rounded-xl ${stylesMapping["width"][width]} ${stylesMapping["border"][border]}`}
>
  <h1 class="font-bold text-xl">{title}</h1>
  {@render children()}
</main>
