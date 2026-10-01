import { state } from "./state.js";

export const money = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2
});

export function formatSafetyMargin() {
  return `${new Intl.NumberFormat("es-ES", { maximumFractionDigits: 1 }).format(state.safetyMargin)} %`;
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
  const enteredTotal = Number(expense.price) * (expense.scope === "person" ? participantCount() : 1);
  const margin = expense.confirmed ? 0 : enteredTotal * (state.safetyMargin / 100);
  return { enteredTotal, margin, budgeted: enteredTotal + margin };
}

export function getBudgetSummary() {
  const totals = state.expenses.reduce((result, expense) => {
    const math = getExpenseMath(expense);
    if (expense.confirmed) result.confirmed += math.enteredTotal;
    else result.unconfirmed += math.budgeted;
    result.total += math.budgeted;
    return result;
  }, { confirmed: 0, unconfirmed: 0, total: 0 });
  const available = getAvailable();
  const difference = totals.total - available;
  const balance = available - totals.total;
  const isBudgetCovered = difference <= 0;
  const statusText = state.calculationMode === "manual" && totals.total > 0
    ? isBudgetCovered ? "Presupuesto bajo control" : `Falta por aportar ${money.format(difference)}`
    : "";
  return {
    totals,
    available,
    difference,
    balance,
    costPerPerson: Math.max(0, difference) / participantCount(),
    progress: totals.total > 0 ? Math.min(100, (available / totals.total) * 100) : 0,
    isBudgetCovered,
    statusText
  };
}