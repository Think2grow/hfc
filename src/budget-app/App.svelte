<script lang="ts">
  import { onMount } from 'svelte';
  import { budgets, createNewBudget } from './store';
  import { selectedBudgetId } from './selected';
  import { defaultIncome, defaultFixed, defaultVariable, defaultIrregular, defaultGoals } from './defaults';
  import { calculateSummary } from './calculate';
  import { exportBudgetToPDF } from './export-pdf';
  import { exportBudgetToExcel } from './export-excel';
  import { exportBudgetToJSON, importBudgetFromJSON } from './import-export-json';
  import type { Budget } from './types';
  import { v4 as uuidv4 } from 'uuid';

  let budgetName = '';
  let showNewBudgetModal = false;
  let showImportModal = false;
  let importJson = '';
  let errorMsg = '';

  // Svelte 5: $ prefix is reserved for store auto-subscriptions, so don't use it for variables
  let budgetsValue: Budget[] = [];
  let selectedBudgetIdValue: string | null = null;

  const unsubBudgets = budgets.subscribe((val: Budget[]) => (budgetsValue = val));
  const unsubSelected = selectedBudgetId.subscribe((val: string | null) => (selectedBudgetIdValue = val));

  function newBudget() {
    budgetName = '';
    showNewBudgetModal = true;
  }

  function createBudget() {
    if (!budgetName.trim()) return;

    const sections = [
      JSON.parse(JSON.stringify(defaultIncome)),
      JSON.parse(JSON.stringify(defaultFixed)),
      JSON.parse(JSON.stringify(defaultVariable)),
      JSON.parse(JSON.stringify(defaultIrregular)),
      JSON.parse(JSON.stringify(defaultGoals)),
    ];

    const budget = createNewBudget(budgetName, sections);
    budgets.update((bs: Budget[]) => [...bs, budget]);
    selectedBudgetId.set(budget.id);
    showNewBudgetModal = false;
  }

  function selectBudget(id: string) {
    selectedBudgetId.set(id);
  }

  function deleteBudgetById(id: string | null) {
    if (!id) return;
    if (confirm('Delete this budget?')) {
      budgets.update((bs: Budget[]) => bs.filter((b) => b.id !== id));
      if (selectedBudgetIdValue === id) selectedBudgetId.set(null);
    }
  }

  function handleImport() {
    const imported = importBudgetFromJSON(importJson);
    if (!imported) {
      errorMsg = 'Invalid JSON';
      return;
    }
    const budget = createNewBudget('Imported Budget', imported);
    budgets.update((bs: Budget[]) => [...bs, budget]);
    selectedBudgetId.set(budget.id);
    showImportModal = false;
    importJson = '';
    errorMsg = '';
  }

  function handleExportJSON(budget: Budget) {
    const json = exportBudgetToJSON(budget.sections);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${budget.name || 'budget'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function formatUSD(val: number) {
  return val.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  $: selectedBudget = budgetsValue.find((b) => b.id === selectedBudgetIdValue) || null;
  $: summary = selectedBudget ? calculateSummary(selectedBudget.sections) : null;

  function updateAmount(sectionIdx: number, rowIdx: number, value: string) {
    // Only allow up to 2 decimal places, and treat input as a number
    let cleaned = value.replace(/[^\d.\-]/g, '');
    // If more than one decimal, keep only the first
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      cleaned = parts[0] + '.' + parts.slice(1).join('').substring(0,2);
    } else if (parts.length === 2) {
      cleaned = parts[0] + '.' + parts[1].substring(0,2);
    }
    // If input is just digits, treat as integer
    let amt = 0;
    if (/^\d+$/.test(cleaned)) {
      amt = parseInt(cleaned, 10);
    } else {
      amt = parseFloat(cleaned) || 0;
    }

    budgets.update((bs: Budget[]) => {
      const copy: Budget[] = JSON.parse(JSON.stringify(bs));
      const b = copy.find((bb) => bb.id === selectedBudgetIdValue);
      if (b) b.sections[sectionIdx].rows[rowIdx].amount = amt;
      return copy;
    });
  }

  function updateLabel(sectionIdx: number, rowIdx: number, value: string) {
    budgets.update((bs: Budget[]) => {
      const copy: Budget[] = JSON.parse(JSON.stringify(bs));
      const b = copy.find((bb) => bb.id === selectedBudgetIdValue);
      if (b) b.sections[sectionIdx].rows[rowIdx].label = value;
      return copy;
    });
  }

  function addRow(sectionIdx: number) {
    budgets.update((bs: Budget[]) => {
      const copy: Budget[] = JSON.parse(JSON.stringify(bs));
      const b = copy.find((bb) => bb.id === selectedBudgetIdValue);
      if (b) b.sections[sectionIdx].rows.push({ id: uuidv4(), label: '', amount: 0, editable: true });
      return copy;
    });
  }

  function removeRow(sectionIdx: number, rowIdx: number) {
    budgets.update((bs: Budget[]) => {
      const copy: Budget[] = JSON.parse(JSON.stringify(bs));
      const b = copy.find((bb) => bb.id === selectedBudgetIdValue);
      if (b && b.sections[sectionIdx].rows.length > 1) b.sections[sectionIdx].rows.splice(rowIdx, 1);
      return copy;
    });
  }

  function startEditing(sectionIdx: number, rowIdx: number) {
    budgets.update((bs: Budget[]) => {
      const copy: Budget[] = JSON.parse(JSON.stringify(bs));
      const b = copy.find((bb) => bb.id === selectedBudgetIdValue);
      if (b) {
        b.sections[sectionIdx].rows[rowIdx]._editing = true;
        b.sections[sectionIdx].rows[rowIdx]._rawValue = b.sections[sectionIdx].rows[rowIdx].amount !== undefined ? String(b.sections[sectionIdx].rows[rowIdx].amount) : '';
      }
      return copy;
    });
  }

  function handleRawInput(sectionIdx: number, rowIdx: number, value: string) {
    budgets.update((bs: Budget[]) => {
      const copy: Budget[] = JSON.parse(JSON.stringify(bs));
      const b = copy.find((bb) => bb.id === selectedBudgetIdValue);
      if (b) {
        b.sections[sectionIdx].rows[rowIdx]._rawValue = value;
      }
      return copy;
    });
  }

  function finishEditing(sectionIdx: number, rowIdx: number) {
    budgets.update((bs: Budget[]) => {
      const copy: Budget[] = JSON.parse(JSON.stringify(bs));
      const b = copy.find((bb) => bb.id === selectedBudgetIdValue);
      if (b) {
        let raw = b.sections[sectionIdx].rows[rowIdx]._rawValue ?? '';
        let cleaned = raw.replace(/[^\d.\-]/g, '');
        // Only allow one decimal
        const parts = cleaned.split('.');
        if (parts.length > 2) {
          cleaned = parts[0] + '.' + parts.slice(1).join('').substring(0,2);
        } else if (parts.length === 2) {
          cleaned = parts[0] + '.' + parts[1].substring(0,2);
        }
        let amt = 0;
        if (/^\d+$/.test(cleaned)) {
          amt = parseInt(cleaned, 10);
        } else {
          amt = parseFloat(cleaned) || 0;
        }
        amt = Math.round(amt * 100) / 100;
        b.sections[sectionIdx].rows[rowIdx].amount = amt;
        b.sections[sectionIdx].rows[rowIdx]._editing = false;
        delete b.sections[sectionIdx].rows[rowIdx]._rawValue;
      }
      return copy;
    });
  }

  onMount(() => {
    if (budgetsValue.length && !selectedBudgetIdValue) {
      selectedBudgetId.set(budgetsValue[0].id);
    }

    return () => {
      // cleanup subscriptions
      unsubBudgets();
      unsubSelected();
    };
  });
</script>


<style>
:global(body) {
  font-family: 'Inter', Arial, sans-serif;
}

.budget-app-container {
  max-width: 900px;
  margin: 0 auto;
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 2px 16px rgba(77, 100, 142, 0.08);
  padding: 2rem 1rem 1.5rem 1rem;
  position: relative;
}

.header-motif {
  background: url('/mountain-motif.svg') no-repeat center top / cover;
  opacity: 0.08;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 120px;
  z-index: 0;
}

.modal-bg {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.18);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: #fff;
  border-radius: 1em;
  padding: 2em 1.5em;
  box-shadow: 0 2px 16px rgba(77, 100, 142, 0.12);
  min-width: 300px;
  max-width: 90vw;
}

/* Responsive layout */
@media (max-width: 900px) {
  .budget-app-container {
    max-width: 100vw;
    padding: 1rem 0.5rem;
  }
}

@media (max-width: 700px) {
  .budget-app-container {
    border-radius: 0.5rem;
    padding: 0.5rem 0.25rem;
  }
  h1 {
    font-size: 1.5rem;
  }
  .header-motif {
    height: 60px;
  }
  .modal {
    padding: 1em 0.5em;
    min-width: 200px;
  }
}

@media (max-width: 600px) {
  .budget-app-container {
    padding: 0.25rem 0.1rem;
  }
  .header-motif {
    height: 40px;
  }
  .modal {
    padding: 0.5em 0.2em;
    min-width: 120px;
  }
  .summary-panel, .budget-inputs {
    min-width: 100%;
    width: 100%;
    flex: 1 1 100%;
  }
  .summary-panel {
    margin-bottom: 1em;
  }
}

/* Table and input adjustments for mobile */
table {
  width: 100%;
}
td {
  padding: 0.2em 0.1em;
}
input[type="text"] {
  min-width: 60px;
  font-size: 1em;
}
button {
  min-width: 32px;
  font-size: 1em;
}
</style>

<div class="budget-app-container">
  <div class="header-motif"></div>

  <h1 style="color:#4d648e; font-weight:700; margin-bottom:0.5em;">My Private Budget</h1>

  <div style="display:flex; gap:1em; flex-wrap:wrap; align-items:center; margin-bottom:1em;">
    <button on:click={newBudget}>New Budget</button>
    <button on:click={() => (showImportModal = true)}>Import JSON</button>

    {#if budgetsValue.length > 0}
      <select
        on:change={(e) => selectBudget((e.currentTarget as HTMLSelectElement).value)}
        bind:value={selectedBudgetIdValue}
      >
        {#each budgetsValue as b}
          <option value={b.id}>{b.name}</option>
        {/each}
      </select>

      <button
        on:click={() => deleteBudgetById(selectedBudgetIdValue)}
        style="background:#e53e3e;"
      >
        Delete
      </button>
    {/if}
  </div>

  {#if selectedBudget && summary}
    <div style="display:flex; flex-wrap:wrap; gap:2em; align-items:flex-start;">
      <!-- Summary Panel -->
      <div
        style="flex:1 1 250px; min-width:220px; background:#f8fafc; border-radius:1em; padding:1em; box-shadow:0 1px 4px rgba(77,100,142,0.04);"
      >
        <h2 style="font-size:1.2em; margin-bottom:0.5em;">Summary</h2>
        <div><b>Total Income:</b> {formatUSD(summary.totalIncome)}</div>
        <div><b>Total Expenses:</b> {formatUSD(summary.totalExpenses)}</div>
        <div>
          <b>Surplus/Deficit:</b>
          <span style="color:{summary.surplus < 0 ? '#e53e3e' : '#4d648e'}">
            {formatUSD(summary.surplus)}
          </span>
        </div>
        <div><b>Savings Rate:</b> {(summary.savingsRate * 100).toFixed(1)}%</div>

        <div style="margin:0.5em 0;">
          <b>50/30/20:</b>
          <div style="display:flex; gap:0.25em; align-items:center;">
            <span
              style="background:#4d648e;opacity:0.7;width:{summary.fiftyThirtyTwenty.needs * 100}%;height:8px;display:inline-block;border-radius:4px;"
            ></span>
            <span
              style="background:#4d648e;opacity:0.4;width:{summary.fiftyThirtyTwenty.wants * 100}%;height:8px;display:inline-block;border-radius:4px;"
            ></span>
            <span
              style="background:#4d648e;opacity:0.2;width:{summary.fiftyThirtyTwenty.savings * 100}%;height:8px;display:inline-block;border-radius:4px;"
            ></span>
          </div>
          <div style="font-size:0.9em;">
            Needs: {(summary.fiftyThirtyTwenty.needs * 100).toFixed(1)}% |
            Wants: {(summary.fiftyThirtyTwenty.wants * 100).toFixed(1)}% |
            Savings: {(summary.fiftyThirtyTwenty.savings * 100).toFixed(1)}%
          </div>
        </div>

        {#if summary.warnings?.length}
          <div style="color:#e53e3e; font-size:0.95em;">
            {#each summary.warnings as w}
              <div>⚠️ {w}</div>
            {/each}
          </div>
        {/if}

        {#if summary.encouragements?.length}
          <div style="color:#4d648e; font-size:0.95em;">
            {#each summary.encouragements as e}
              <div>💡 {e}</div>
            {/each}
          </div>
        {/if}

        <div style="margin-top:1em;display:flex;gap:0.5em;flex-wrap:wrap;">
          <button on:click={() => exportBudgetToPDF(selectedBudget, summary)}>Export PDF</button>
          <button on:click={() => exportBudgetToExcel(selectedBudget)}>Export Excel</button>
          <button on:click={() => handleExportJSON(selectedBudget)}>Export JSON</button>
        </div>
      </div>

      <!-- Budget Input Sections -->
      <div style="flex:2 1 350px; min-width:300px;">
        {#each selectedBudget.sections as section, sIdx}
          <div style="margin-bottom:1.5em;">
            <h3 style="margin-bottom:0.25em; color:#4d648e;">{section.title}</h3>

            <table style="width:100%; border-collapse:separate; border-spacing:0 0.25em;">
              <tbody>
                {#each section.rows as row, rIdx}
                  <tr>
                    <td style="width:10%; text-align:right;">
                      <button on:click={() => removeRow(sIdx, rIdx)} style="background:#e2e8f0; color:#4d648e; margin-right:0.5em;">
                        -
                      </button>
                    </td>
                    <td style="width:45%;">
                      <input
                        type="text"
                        value={row.label}
                        on:input={(e) => updateLabel(sIdx, rIdx, (e.currentTarget as HTMLInputElement).value)}
                        placeholder="Label"
                        style="width:98%;"
                      />
                    </td>
                    <td style="width:35%;">
                      {#if row._editing}
                        <input
                          type="text"
                          value={row._rawValue}
                          on:input={(e) => handleRawInput(sIdx, rIdx, (e.currentTarget as HTMLInputElement).value)}
                          on:blur={() => finishEditing(sIdx, rIdx)}
                          placeholder="$0.00"
                          style="width:98%; text-align:right;"
                          inputmode="decimal"
                          pattern="^\d*(\.\d{0,2})?$"
                        />
                      {:else}
                        <div
                          on:click={() => startEditing(sIdx, rIdx)}
                          style="width:98%; text-align:right; cursor:pointer;"
                        >
                          {row.amount !== undefined ? Number(row.amount).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) : ''}
                        </div>
                      {/if}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>

            <button on:click={() => addRow(sIdx)} style="margin-top:0.25em;">+ Add Row</button>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- New Budget Modal -->
  {#if showNewBudgetModal}
    <div class="modal-bg">
      <div class="modal">
        <h2>New Budget</h2>
        <input type="text" bind:value={budgetName} placeholder="Budget Name" />
        <div style="margin-top:1em;display:flex;gap:1em;">
          <button on:click={createBudget}>Create</button>
          <button on:click={() => (showNewBudgetModal = false)} style="background:#e2e8f0; color:#4d648e;">
            Cancel
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Import Modal -->
  {#if showImportModal}
    <div class="modal-bg">
      <div class="modal">
        <h2>Import Budget (JSON)</h2>
        <textarea bind:value={importJson} rows="8" style="width:100%;"></textarea>

        {#if errorMsg}
          <div style="color:#e53e3e;">{errorMsg}</div>
        {/if}

        <div style="margin-top:1em;display:flex;gap:1em;">
          <button on:click={handleImport}>Import</button>
          <button
            on:click={() => {
              showImportModal = false;
              importJson = '';
              errorMsg = '';
            }}
            style="background:#e2e8f0; color:#4d648e;"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
