<script lang="ts">
    import { onMount } from "svelte";
    import "../app.css";
    import { formatAmount } from "../services";
    import Section from "../components/Section.svelte";

    // data variables
    let equityData = [];
    let lastTransactions = [];

    // make async
    function fetchEquity() {
        return [
            {
                id: 1,
                value: 14671.23,
                currency: "$",
                lastTransactionsUrl: "/analytics/last-transactions",
            },
            {
                id: 2,
                value: 500.44,
                currency: "₴",
                lastTransactionsUrl: "/analytics/last-transactions",
            },
        ];
    }

    function fetchLastTransactions() {
        return ["something", "something else"];
    }

    onMount(() => {
        equityData = fetchEquity();
        lastTransactions = fetchLastTransactions();
    });
</script>

<div class="homePage">
    <Section title="equity">
        <div class="equityItems">
            {#each equityData as equity}
                <a href={equity.lastTransactionsUrl}>
                    {formatAmount(equity.value)}{equity.currency}
                </a>
            {/each}
        </div>
    </Section>
    <Section title="last transactions">
        <div class="lastTransactions">
            {#each lastTransactions as item}
                <p>{item}</p>
            {/each}
        </div>
    </Section>
    <Section title="actions">
        <div class="quickActions">
            <a href="/costs" class="quickActionButton addCostButton">cost</a>
            <a href="/incomes" class="quickActionButton addIncomeButton"
                >income</a
            >
            <a href="/transactions" class="quickActionButton addExchangeButton"
                >exchange</a
            >
        </div>
    </Section>
</div>

<style>
    /* General */
    .homePage {
        align-items: center;
        padding: 10px;
    }

    /* Equity Section */
    .equityItems {
        display: flex;
        justify-content: space-around;
        text-align: center;
        align-content: center;
    }

    /* Last Transactions Section */
    .lastTransactions {
        display: flex;
        flex-direction: column;
    }

    /* Quick Actions Section */
    .quickActions {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    .quickActionButton {
        padding: 20px;
        font-weight: normal;
        font-size: x-large;
        width: calc(100% - 50px);
        text-align: center;
        border: solid white;
        border-radius: 4px;
    }
    .addCostButton {
        background: #ba535f;
    }
    .addIncomeButton {
        background: #5cb565;
    }
    .addExchangeButton {
        background: #5b9fd3;
    }
</style>
