<script>
    let { title, border = 4 } = $props();
</script>

<div class="section" style=" {border}px;">
    <h2 class="section-title">{title}</h2>

    <div class="section-content">
        <slot />
    </div>
</div>

<style>
    .section {
        margin: 20px 0;
        padding: 26px;
        border: solid white;
        border-radius: 4px;
        border-style: solid;
    }

    .section-title {
        font-weight: normal;
        color: #7ed4ad;
    }

    .section-content {
        margin-top: 36px; /* Space between title and child content */
    }
</style>
