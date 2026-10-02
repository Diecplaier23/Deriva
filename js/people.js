import { $ } from "./dom.js";
import { participantCount } from "./calculations.js";
import { saveState } from "./storage.js";
import { createPersonId, state } from "./state.js";

let renderAppCallback;
let renderSummaryCallback;

export function initializePeople({ renderApp, renderSummary }) {
  renderAppCallback = renderApp;
  renderSummaryCallback = renderSummary;
  $("addPersonButton").addEventListener("click", addPerson);
  $("splitAddPersonButton").addEventListener("click", addPerson);
}

export function syncPersonName(index, value, source) {
  const person = state.people[index];
  if (!person) return;
  person.name = value;
  saveState();
  const displayName = value.trim() || `Persona ${index + 1}`;
  const summaryName = $("summaryPeople").children[index]?.querySelector("span");
  if (summaryName) summaryName.textContent = displayName;
  const mainName = $("contributionList").children[index]?.querySelector('input[type="text"]');
  const splitName = $("splitPeopleList").children[index]?.querySelector('input[type="text"]');
  if (mainName && mainName !== source) mainName.value = value;
  if (splitName && splitName !== source) splitName.value = value;
}

export function removePerson(index) {
  if (participantCount() === 1) return;
  const [removedPerson] = state.people.splice(index, 1);
  state.expenses.forEach((expense) => {
    if (expense.scope === "selected") {
      expense.selectedPeople = expense.selectedPeople.filter((personId) => personId !== removedPerson.id);
    }
  });
  saveState();
  renderAppCallback();
}

export function createPersonRemoveButton(index) {
  const person = state.people[index];
  const button = document.createElement("button");
  button.type = "button";
  button.className = "remove-person-button";
  button.textContent = "Quitar";
  button.disabled = participantCount() === 1;
  button.title = button.disabled ? "Debe haber al menos una persona" : `Quitar ${person.name.trim() || `Persona ${index + 1}`}`;
  button.setAttribute("aria-label", `Quitar persona ${index + 1}`);
  button.addEventListener("click", () => removePerson(index));
  return button;
}

export function renderContributions() {
  const list = $("contributionList");
  const isAutomatic = state.calculationMode === "automatic";
  list.replaceChildren();
  $("automaticModeButton").classList.toggle("active", isAutomatic);
  $("automaticModeButton").setAttribute("aria-pressed", String(isAutomatic));
  $("manualModeButton").classList.toggle("active", !isAutomatic);
  $("manualModeButton").setAttribute("aria-pressed", String(!isAutomatic));
  $("peopleSectionTitle").textContent = isAutomatic ? "Personas del viaje" : "Aportaciones disponibles";
  $("savingsHelper").textContent = isAutomatic
    ? "Saldo general disponible para el viaje."
    : "Saldo general, aparte de las aportaciones individuales.";
  $("contributionHelper").textContent = isAutomatic
    ? "El presupuesto total se divide a partes iguales entre todas las personas."
    : "Los ahorros y las aportaciones individuales se suman al dinero disponible.";
  state.people.forEach((person, index) => {
    const row = document.createElement("div");
    row.className = isAutomatic ? "contribution-row people-row" : "contribution-row";
    const name = document.createElement("input");
    name.type = "text";
    name.maxLength = 50;
    name.value = person.name;
    name.placeholder = `Persona ${index + 1}`;
    name.setAttribute("aria-label", `Nombre de la persona ${index + 1}`);
    name.addEventListener("input", () => syncPersonName(index, name.value, name));
    const contribution = document.createElement("input");
    contribution.type = "number";
    contribution.min = "0";
    contribution.step = "0.01";
    contribution.inputMode = "decimal";
    contribution.value = person.contribution;
    contribution.hidden = isAutomatic;
    contribution.placeholder = "Aportación (€)";
    contribution.setAttribute("aria-label", `Aportación de la persona ${index + 1} en euros`);
    contribution.addEventListener("input", () => {
      person.contribution = contribution.value;
      saveState();
      renderSummaryCallback();
    });
    const remove = createPersonRemoveButton(index);
    row.append(name, contribution, remove);
    list.append(row);
  });
  const count = participantCount();
  $("peopleCountLabel").textContent = `${count} ${count === 1 ? "persona" : "personas"}`;
  $("addPersonButton").disabled = count >= 99;
  $("splitAddPersonButton").disabled = count >= 99;
}

function addPerson() {
  if (participantCount() >= 99) return;
  state.people.push({ id: createPersonId(), name: "", contribution: "", paid: false });
  saveState();
  renderAppCallback();
  if (!$('budgetView').hidden) $("contributionList").lastElementChild.querySelector("input").focus();
}