import { state } from "./state.js";
import { translateText } from "./i18n.js";

function createMoneyFormatter(currency) {
  const locale = currency === "USD" ? "en-US" : state.language === "en" || currency === "GBP" ? "en-GB" : "es-ES";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2
  });
}

export let money = createMoneyFormatter(state.currency);

export function setCurrency(currency) {
  money = createMoneyFormatter(["USD", "GBP"].includes(currency) ? currency : "EUR");
}

export function setMoneyLocale() {
  money = createMoneyFormatter(state.currency);
}

export function formatSafetyMargin() {
  const locale = state.language === "en" ? "en-GB" : "es-ES";
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(state.safetyMargin)} %`;
}

export function participantCount() {
  return state.people.length;
}

export function getContributions() {
  return state.people.reduce((total, person) => total + (Number(person.contribution) || 0), 0);
}

export function getAvailable() {
  const contributions = state.calculationMode === "manual" ? getContributions() : 0;
  return contributions + (Number(state.savings) || 0);
}

export function getRemainingCost(total, availableFunds = Number(state.savings) || 0) {
  return Math.max(0, total - availableFunds);
}

export function getExpenseMath(expense) {
  const affectedPeople = expense.scope === "selected"
    ? state.people.filter((person) => expense.selectedPeople?.includes(person.id)).length
    : participantCount();
  const multiplier = expense.scope === "person" ? participantCount() : expense.scope === "selected" ? affectedPeople : 1;
  const enteredTotal = Number(expense.price) * multiplier;
  const margin = expense.confirmed ? 0 : enteredTotal * (state.safetyMargin / 100);
  return { enteredTotal, margin, budgeted: enteredTotal + margin, affectedPeople };
}

export function getBudgetSummary() {
  const personBudgets = new Map(state.people.map((person) => [person.id, 0]));
  const totals = state.expenses.reduce((result, expense) => {
    const math = getExpenseMath(expense);
    if (expense.confirmed) result.confirmed += math.enteredTotal;
    else result.unconfirmed += math.budgeted;
    result.total += math.budgeted;
    if (expense.scope !== "selected") result.shared += math.budgeted;
    const affectedPeople = expense.scope === "selected"
      ? state.people.filter((person) => expense.selectedPeople?.includes(person.id))
      : state.people;
    const perPerson = math.budgeted / (expense.scope === "selected" ? Math.max(1, affectedPeople.length) : participantCount());
    affectedPeople.forEach((person) => personBudgets.set(person.id, personBudgets.get(person.id) + perPerson));
    return result;
  }, { confirmed: 0, unconfirmed: 0, total: 0, shared: 0 });
  const available = getAvailable();
  const difference = totals.total - available;
  const balance = Math.max(0, available - totals.total);
  const isBudgetCovered = difference <= 0;
  const remainingRatio = totals.total > 0 ? Math.max(0, difference) / totals.total : 0;
  const personCosts = new Map(Array.from(personBudgets, ([personId, budget]) => [personId, budget * remainingRatio]));
  const statusText = totals.total > 0
    ? isBudgetCovered
      ? state.calculationMode === "manual" ? "Presupuesto bajo control" : ""
      : translateText("Falta por aportar {amount}").replace("{amount}", money.format(difference))
    : "";
  return {
    totals,
    available,
    difference,
    balance,
    personCosts,
    costPerPerson: (totals.shared * remainingRatio) / participantCount(),
    progress: totals.total > 0 ? Math.min(100, (available / totals.total) * 100) : 0,
    isBudgetCovered,
    statusText
  };
}