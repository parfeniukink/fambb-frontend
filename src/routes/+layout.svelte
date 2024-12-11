<script lang="ts">
  import "../app.css";
  import { initPersistentStore } from "../data/store";
  import { isAuthorized } from "../services";

  let { children } = $props();

  let secret = $state("");
  let authErrorMessage = $state("");
  let authorized = $state(isAuthorized());

  async function handleSecretSubmit() {
    try {
      await initPersistentStore(secret);
      authorized = true;
    } catch (e) {
      console.error(e);
      authErrorMessage = "invalid secret";
      authorized = false;
    }
  }
</script>

{#if !authorized}
  <div class="authBlock">
    {#if authErrorMessage != ""}
      <p class="authError">{authErrorMessage}</p>
    {/if}
    <form onsubmit={handleSecretSubmit}>
      <input
        type="password"
        bind:value={secret}
        placeholder="enter secret"
        required
      />
      <button type="submit">submit</button>
    </form>
  </div>
{:else}
  <div class="rootPage">
    <div class="viewport">
      {@render children()}
    </div>

    <nav>
      <a href="/">🏠 home</a>
      <a href="/analytics">📊 analytics</a>
      <a href="/shortcuts">📝 shortcuts</a>
      <a href="/settings">🛠️ settings</a>
    </nav>
  </div>
{/if}

<style>
  .rootPage {
    margin-bottom: 30px;
    height: 100%;
  }
  .viewport {
    padding: 0 20px;
  }

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
    color: #32c181;
    text-align: center;
    text-decoration: none;
    flex-grow: 1;
    font-size: 1rem;
  }

  nav a:hover {
    color: white;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  input {
    padding: 0.5rem;
    font-size: 1rem;
  }

  button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    cursor: pointer;
  }
  .authBlock {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: calc(50%) 0 auto;
  }

  p {
    color: #ba535f;
    text-align: left;
  }
</style>
