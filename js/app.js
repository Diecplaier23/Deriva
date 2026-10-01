import { $ } from "./dom.js";
import { ALL_CATEGORIES } from "./categories.js";
import { formatSafetyMargin, getBudgetSummary, getContributions, money } from "./calculations.js";
import { initializeDownload } from "./download.js";
import { initializeExpenses, renderExpenses } from "./expenses.js";
import { initializePeople, renderContributions } from "./people.js";
import { resetStoredState, loadState, saveState } from "./storage.js";
import { initializeSplit, updateSplitCalculator } from "./split.js";
import { setState, state } from "./state.js";

setState(loadState(ALL_CATEGORIES));

function updateMarginLabels() {
  $("marginRateLabel").textContent = formatSafetyMargin();
  $("dialogMarginRate").textContent = formatSafetyMargin();
}

function renderSummary() {
  const summary = getBudgetSummary();
  const { totals, available, balance, costPerPerson, progress, isBudgetCovered, statusText } = summary;
  const budgetStatus = $("budgetStatus");
  budgetStatus.hidden = !statusText;
  budgetStatus.classList.toggle("is-covered", isBudgetCovered);
  budgetStatus.classList.toggle("is-shortfall", !isBudgetCovered);
  budgetStatus.textContent = statusText;
  $("totalBudget").textContent = money.format(totals.total);
  $("confirmedTotal").textContent = money.format(totals.confirmed);
  $("unconfirmedTotal").textContent = money.format(totals.unconfirmed);
  $("availableTotal").textContent = money.format(available);
  $("budgetProgress").style.width = `${progress}%`;
  $("budgetProgress").parentElement.setAttribute("aria-valuenow", String(Math.round(progress)));
  const peopleSummary = $("summaryPeople");
  peopleSummary.replaceChildren();
  $("summaryPeopleTitle").textContent = "Coste pendiente por persona y saldo restante";
  state.people.forEach((person, index) => {
    const row = document.createElement("div");
    row.className = "summary-person";
    const name = document.createElement("span");
    name.textContent = person.name.trim() || `Persona ${index + 1}`;
    const amount = document.createElement("strong");
    amount.textContent = money.format(costPerPerson);
    row.append(name, amount);
    peopleSummary.append(row);
  });
  const savingsRow = document.createElement("div");
  savingsRow.className = "summary-person";
  const savingsLabel = document.createElement("span");
  savingsLabel.textContent = "Saldo tras gastos";
  const savingsAmount = document.createElement("strong");
  savingsAmount.textContent = money.format(balance);
  savingsRow.append(savingsLabel, savingsAmount);
  peopleSummary.append(savingsRow);
  $("contributionTotal").textContent = state.calculationMode === "automatic"
    ? `${money.format(costPerPerson)} por persona`
    : money.format(getContributions());
  updateSplitCalculator();
}

function renderApp() {
  $("destination").value = state.destination;
  $("splitDestination").value = state.destination;
  $("savings").value = state.savings;
  $("safetyMargin").value = state.safetyMargin;
  updateMarginLabels();
  renderContributions();
  renderExpenses();
  renderSummary();
}

function setCalculationMode(mode) {
  state.calculationMode = mode;
  saveState();
  renderApp();
}

function showView(view) {
  const showSplit = view === "split";
  $("mainIntro").hidden = showSplit;
  $("budgetView").hidden = showSplit;
  $("splitView").hidden = !showSplit;
  $("budgetModeButton").classList.toggle("active", !showSplit);
  $("budgetModeButton").setAttribute("aria-pressed", String(!showSplit));
  $("splitModeButton").classList.toggle("active", showSplit);
  $("splitModeButton").setAttribute("aria-pressed", String(showSplit));
  if (showSplit) $("splitTotal").focus();
}

function resetAll() {
  $("resetDialog").close();
  resetStoredState();
  $("splitTotal").value = "";
  renderApp();
  updateSplitCalculator();
  showView("budget");
}

initializePeople({ renderApp, renderSummary });
initializeExpenses({ renderApp });
initializeSplit({ renderApp });
initializeDownload();

$("destination").addEventListener("input", (event) => {
  state.destination = event.target.value;
  $("splitDestination").value = event.target.value;
  saveState();
});
$("splitDestination").addEventListener("input", (event) => {
  state.destination = event.target.value;
  $("destination").value = event.target.value;
  saveState();
});
$("savings").addEventListener("input", (event) => {
  state.savings = event.target.value;
  saveState();
  renderSummary();
});
$("safetyMargin").addEventListener("input", (event) => {
  const value = event.target.valueAsNumber;
  if (!Number.isFinite(value) || value < 0 || value > 100) return;
  state.safetyMargin = value;
  saveState();
  updateMarginLabels();
  renderExpenses();
  renderSummary();
});
$("safetyMargin").addEventListener("change", (event) => {
  const value = event.target.valueAsNumber;
  if (!Number.isFinite(value) || value < 0 || value > 100) event.target.value = state.safetyMargin;
});
$("budgetModeButton").addEventListener("click", () => showView("budget"));
$("splitModeButton").addEventListener("click", () => showView("split"));
$("backToBudgetButton").addEventListener("click", () => showView("budget"));
$("automaticModeButton").addEventListener("click", () => setCalculationMode("automatic"));
$("manualModeButton").addEventListener("click", () => setCalculationMode("manual"));
$("resetAllButton").addEventListener("click", () => $("resetDialog").showModal());
$("cancelResetButton").addEventListener("click", () => $("resetDialog").close());
$("confirmResetButton").addEventListener("click", resetAll);

renderApp();