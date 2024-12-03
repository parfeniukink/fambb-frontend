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
    /* hcolor: #7ed4ad; */
    color: white;
  }
  .section {
    margin: 20px 0;
    padding: 26px;
    border-radius: 4px;
  }
  .section-content {
    margin-top: 36px; /* Space between title and child content */
  }
</style>
