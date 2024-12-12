<script>
  let { children, title, border = 2 } = $props();
</script>

<div class="section" style="border:solid {border}px white;">
  <h2 class="section-title">{title}</h2>

  <div class="section-content">
    {@render children()}
  </div>
</div>

<style>
  h2 {
    font-weight: normal;
    font-size: x-large;
    /* color: #7ed4ad; */
    color: white;
  }
  .section {
    margin: 20px 0;
    padding: 26px;
    border-radius: 4px;
    overflow: hidden;
  }
  .section-content {
    /* Space between title and child content */
    margin-top: 36px;
    /* Allow horizontal scrolling */
    overflow-x: scroll;
    /* Prevent wrapping */
    white-space: nowrap;
    /* Avoid overlap with scrollbar */
    /* padding-bottom: 10px; */

    /* Hide scrollbar for WebKit browsers (Chrome, Safari) */
    &::-webkit-scrollbar {
      display: none;
    }

      /* Hide scrollbar for Firefox */
    scrollbar-width: none;
    scroll-behavior: smooth;
  }
</style>
