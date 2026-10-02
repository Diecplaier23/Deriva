import { createInitialState, createPersonId, setState, state } from "./state.js";

export const STORAGE_KEY = "rumbo-trip-budget";

export function loadState(categories) {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || !Array.isArray(saved.people) || !Array.isArray(saved.expenses)) return createInitialState();
    const people = saved.people.slice(0, 99).map((person) => ({
      id: typeof person.id === "string" && person.id ? person.id : createPersonId(),
      name: typeof person.name === "string" ? person.name.slice(0, 50) : "",
      contribution: Number.isFinite(Number(person.contribution)) && Number(person.contribution) >= 0 ? String(person.contribution) : "",
      paid: Boolean(person.paid)
    }));
    const expenses = saved.expenses.map((expense) => {
      const type = typeof expense.type === "string" ? expense.type : expense.category;
      const category = categories.find((item) => item.name === type
        && (typeof expense.type !== "string" || item.group === expense.category));
      if (!category || !Number.isFinite(Number(expense.price)) || Number(expense.price) < 0) return null;
      return {
        id: String(expense.id), category: category.group, type: category.name,
        description: typeof expense.description === "string" ? expense.description.slice(0, 100) : "",
        price: Number(expense.price),
        scope: expense.scope === "person" || expense.scope === "selected" ? expense.scope : "group",
        selectedPeople: Array.isArray(expense.selectedPeople)
          ? [...new Set(expense.selectedPeople.filter((personId) => typeof personId === "string" && people.some((person) => person.id === personId)))]
          : [],
        confirmed: Boolean(expense.confirmed)
      };
    }).filter(Boolean);
    const safetyMargin = Number(saved.safetyMargin);
    return {
      destination: typeof saved.destination === "string" ? saved.destination.slice(0, 80) : "",
      savings: Number.isFinite(Number(saved.savings)) && Number(saved.savings) >= 0 ? String(saved.savings) : "",
      safetyMargin: Number.isFinite(safetyMargin) && safetyMargin >= 0 && safetyMargin <= 100 ? safetyMargin : 10,
      calculationMode: saved.calculationMode === "manual" ? "manual" : "automatic",
      people: people.length ? people : [{ name: "", contribution: "" }],
      expenses
    };
  } catch {
    return createInitialState();
  }
}

export function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

export function resetStoredState() {
  setState(createInitialState());
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}