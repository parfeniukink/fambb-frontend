<script>
    let { message = "", isVisible = false, duration = 3000 } = $props();

    // Function to show the modal
    export function showModal(msg) {
        message = msg; // Set the error message
        isVisible = true; // Show the modal
        setTimeout(() => {
            isVisible = false; // Hide the modal after the duration
        }, duration);
    }
</script>

{#if isVisible}
    <div class="error-modal">
        <p>{message}</p>
    </div>
{/if}

<style>
    .error-modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #b03052;
        color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        text-align: center;
    }
</style>
