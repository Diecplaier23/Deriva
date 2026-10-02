import { $ } from "./dom.js";
import { getBudgetSummary, getRemainingCost, money, participantCount } from "./calculations.js";
import { createPersonRemoveButton, syncPersonName } from "./people.js";
import { saveState } from "./storage.js";
import { state } from "./state.js";

let renderAppCallback;

export function initializeSplit({ renderApp }) {
  renderAppCallback = renderApp;
  $("splitTotal").addEventListener("input", updateSplitCalculator);
}

export function updateSplitCalculator() {
  const total = $("splitTotal").value;
  const remainingFunds = Math.max(0, getBudgetSummary().balance);
  const numericTotal = Number(total);
  const hasTotal = total !== "" && Number.isFinite(numericTotal) && numericTotal >= 0;
  const totalAmount = hasTotal ? numericTotal : 0;
  $("splitPerPerson").textContent = money.format(getRemainingCost(totalAmount, remainingFunds) / participantCount());
  renderSplitPeople(total, remainingFunds);
  renderSplitSummary(total, remainingFunds);
}

function renderSplitSummary(total, remainingFunds) {
  if ($("splitView").hidden) return;
  const hasTotal = total !== "" && Number.isFinite(Number(total)) && Number(total) >= 0;
  const totalAmount = hasTotal ? Number(total) : 0;
  const coveredByTrip = Math.min(totalAmount, remainingFunds);
  const toSplit = getRemainingCost(totalAmount, remainingFunds);
  const perPerson = toSplit / participantCount();
  const paidAmount = state.people.filter((person) => person.paid).length * perPerson;
  const pendingAmount = Math.max(0, toSplit - paidAmount);
  const metrics = [
    ["totalBudgetLabel", "Coste total conocido", totalAmount],
    ["confirmedTotalLabel", "Saldo del viaje aplicado", coveredByTrip],
    ["unconfirmedTotalLabel", "Pagado por el grupo", paidAmount],
    ["availableTotalLabel", "Pendiente de pago", pendingAmount]
  ];
  $("summaryCardTitle").textContent = "Resumen del reparto";
  metrics.forEach(([labelId, label, value]) => {
    $(labelId).textContent = label;
    $(labelId.replace("Label", "")).textContent = money.format(value);
  });
  $("unconfirmedSummaryMetric").hidden = false;
  $("budgetSafetyNote").hidden = true;
  $("splitSafetyNote").hidden = !hasTotal;
  $("summaryPeopleTitle").textContent = "Reparto por persona";
  const progress = totalAmount > 0 ? Math.min(100, ((coveredByTrip + paidAmount) / totalAmount) * 100) : 0;
  const progressBar = $("budgetProgress").parentElement;
  $("budgetProgress").style.width = `${progress}%`;
  progressBar.setAttribute("aria-label", "Coste cubierto por el saldo del viaje y los pagos");
  progressBar.setAttribute("aria-valuenow", String(Math.round(progress)));
  const budgetStatus = $("budgetStatus");
  const isCovered = pendingAmount <= 0;
  budgetStatus.hidden = !hasTotal || totalAmount === 0;
  budgetStatus.classList.toggle("is-covered", isCovered);
  budgetStatus.classList.toggle("is-shortfall", !isCovered);
  budgetStatus.textContent = isCovered ? "Coste cubierto" : `Falta por pagar ${money.format(pendingAmount)}`;
  const peopleSummary = $("summaryPeople");
  peopleSummary.replaceChildren();
  state.people.forEach((person, index) => {
    const row = document.createElement("div");
    row.className = "summary-person";
    const name = document.createElement("span");
    name.textContent = `${person.name.trim() || `Persona ${index + 1}`} · ${person.paid ? "Pagado" : "Pendiente"}`;
    const amount = document.createElement("strong");
    amount.textContent = money.format(perPerson);
    row.append(name, amount);
    peopleSummary.append(row);
  });
}

function renderSplitPeople(total = $("splitTotal").value, remainingFunds = Math.max(0, getBudgetSummary().balance)) {
  const count = participantCount();
  const numericTotal = Number(total);
  const validTotal = total !== "" && Number.isFinite(numericTotal) && numericTotal >= 0;
  const perPerson = money.format(validTotal ? getRemainingCost(numericTotal, remainingFunds) / count : 0);
  $("splitPeopleCount").textContent = `${count} ${count === 1 ? "persona" : "personas"}`;
  const list = $("splitPeopleList");
  list.replaceChildren();
  state.people.forEach((person, index) => {
    const row = document.createElement("div");
    row.className = `split-person-row${person.paid ? " is-paid" : ""}`;
    const name = document.createElement("input");
    name.type = "text";
    name.className = "split-person-name";
    name.maxLength = 50;
    name.value = person.name;
    name.placeholder = `Persona ${index + 1}`;
    name.setAttribute("aria-label", `Nombre de la persona ${index + 1}`);
    name.addEventListener("input", () => syncPersonName(index, name.value, name));
    const paidButton = document.createElement("button");
    paidButton.type = "button";
    paidButton.className = `person-paid-button${person.paid ? " is-paid" : ""}`;
    paidButton.textContent = person.paid ? "✓ Pagado" : "Pagado";
    paidButton.setAttribute("aria-pressed", String(person.paid));
    paidButton.addEventListener("click", () => {
      person.paid = !person.paid;
      saveState();
      row.classList.toggle("is-paid", person.paid);
      paidButton.classList.toggle("is-paid", person.paid);
      paidButton.textContent = person.paid ? "✓ Pagado" : "Pagado";
      paidButton.setAttribute("aria-pressed", String(person.paid));
      renderSplitSummary(total, remainingFunds);
    });
    const amount = document.createElement("strong");
    amount.textContent = perPerson;
    const remove = createPersonRemoveButton(index);
    row.append(name, paidButton, amount, remove);
    list.append(row);
  });
}