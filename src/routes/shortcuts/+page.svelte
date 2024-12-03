<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  onMount(() => {
    console.log("mounted");
  });
  onDestroy(() => {
    console.log("destroy");
  });

  console.log("Hello");
</script>

<h1>Shortcuts</h1>

<ul>
  <li>Shortcut 1</li>
  <li>Shortcut 2</li>
  <li>Shortcut 3</li>
</ul>

<h1>content</h1>

<style>
  h1 {
    color: red;
  }
</style>
