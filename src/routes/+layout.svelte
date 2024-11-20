<script lang="ts">
    import "../app.css";
</script>

<div class="rootPage">
    <div class="viewport">
        <slot />
    </div>

    <nav>
        <a href="/">home</a>
        <a href="/analytics">shortcuts</a>
        <a href="/shortcuts">shortcuts</a>
        <a href="/settings">settings</a>
    </nav>
</div>

<style>
    nav {
        position: fixed;
        height: 60px;
        width: 100%;
        bottom: 0;
        display: flex;
        justify-content: space-around;
        align-items: center; /* # vertical align */
        padding: 0.75rem 0; /* slim padding */
        border-top: 2px solid white;
        background: var(--pico-background-color);
    }

    nav a {
        color: #7ed4ad;
        text-align: center;
        text-decoration: none;
        flex-grow: 1;
        font-size: 1rem;
    }

    nav a:hover {
        color: white;
    }

    .rootPage {
        margin-bottom: 30px;
        height: 100%;
    }
    .viewport {
        padding: 0 20px;
    }
</style>
