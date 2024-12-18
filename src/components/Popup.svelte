<script lang="ts">
  import { popupStore } from "../data/store";
  import { fade } from "svelte/transition";
</script>

{#if $popupStore}
  <div class="popup" in:fade out:fade>
    {$popupStore!.message}
  </div>
{/if}

<style>
  .popup {
    position: fixed;
    top: calc(5%);
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 34px;
    border-radius: 4px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0);
    z-index: 1000;
    font-size: small;
    color: black;
    background-color: #779155;
    opacity: 80%;
  }
</style>
