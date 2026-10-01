import { $ } from "./dom.js";
import { money, participantCount } from "./calculations.js";
import { syncPersonName } from "./people.js";
import { saveState } from "./storage.js";
import { state } from "./state.js";

let renderAppCallback;

export function initializeSplit({ renderApp }) {
  renderAppCallback = renderApp;
  $("splitTotal").addEventListener("input", updateSplitCalculator);
}

export function updateSplitCalculator() {
  const total = $("splitTotal").value;
  $("splitPerPerson").textContent = total === "" || !Number.isFinite(Number(total))
    ? "—"
    : money.format(Number(total) / participantCount());
  renderSplitPeople(total);
}

function renderSplitPeople(total = $("splitTotal").value) {
  const count = participantCount();
  const validTotal = total !== "" && Number.isFinite(Number(total));
  const perPerson = validTotal ? money.format(Number(total) / count) : "—";
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
    });
    const amount = document.createElement("strong");
    amount.textContent = perPerson;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-person-button";
    remove.textContent = "Quitar";
    remove.disabled = count === 1;
    remove.title = remove.disabled ? "Debe haber al menos una persona" : `Quitar ${person.name.trim() || `Persona ${index + 1}`}`;
    remove.setAttribute("aria-label", `Quitar persona ${index + 1}`);
    remove.addEventListener("click", () => {
      if (participantCount() === 1) return;
      state.people.splice(index, 1);
      saveState();
      renderAppCallback();
    });
    row.append(name, paidButton, amount, remove);
    list.append(row);
  });
}