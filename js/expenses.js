import { $ } from "./dom.js";
import { ALL_CATEGORIES, CATEGORIES } from "./categories.js";
import { money, formatSafetyMargin, getExpenseMath, participantCount } from "./calculations.js";
import { saveState } from "./storage.js";
import { state } from "./state.js";

let renderAppCallback;
let editingExpenseId = null;
let selectedCategory = null;

export function initializeExpenses({ renderApp }) {
  renderAppCallback = renderApp;
  $("addExpenseButton").addEventListener("click", () => openExpenseDialog());
  $("closeExpenseDialog").addEventListener("click", () => $("expenseDialog").close());
  $("cancelExpense").addEventListener("click", () => $("expenseDialog").close());
  $("changeCategory").addEventListener("click", () => {
    selectedCategory = null;
    $("expenseFields").hidden = true;
    $("saveExpense").hidden = true;
    $("dialogError").hidden = true;
    renderCategories();
    $("categoryGroups").querySelector(".category-option")?.focus();
  });
  $("expenseForm").addEventListener("submit", saveExpenseFromForm);
}

function createExpenseElement(expense) {
  const category = ALL_CATEGORIES.find((item) => item.group === expense.category && item.name === expense.type);
  const type = expense.type || expense.category;
  const math = getExpenseMath(expense);
  const item = document.createElement("article");
  item.className = "expense-item";
  const main = document.createElement("div");
  main.className = "expense-item-main";
  const title = document.createElement("div");
  title.className = "expense-item-title";
  const name = document.createElement("strong");
  name.textContent = type;
  title.append(name);
  main.append(title);
  if (expense.description) {
    const description = document.createElement("p");
    description.className = "expense-description";
    description.textContent = expense.description;
    main.append(description);
  }
  const scope = document.createElement("p");
  scope.className = "expense-scope";
  scope.textContent = expense.scope === "person"
    ? `${money.format(expense.price)} por persona · ${money.format(math.enteredTotal)} para ${participantCount()}`
    : "Todo el grupo";
  main.append(scope);

  const amount = document.createElement("div");
  amount.className = "expense-math";
  const entered = document.createElement("span");
  entered.className = "expense-entered";
  entered.textContent = expense.scope === "person" ? `${money.format(expense.price)} / persona` : `${money.format(math.enteredTotal)} introducidos`;
  amount.append(entered);
  if (!expense.confirmed) {
    const margin = document.createElement("span");
    margin.className = "expense-margin";
    margin.textContent = `+${money.format(math.margin)} de margen (${formatSafetyMargin()})`;
    amount.append(margin);
  }
  const budgeted = document.createElement("span");
  budgeted.className = "expense-budgeted";
  budgeted.textContent = `${money.format(math.budgeted)} presupuestados`;
  const perPerson = document.createElement("span");
  perPerson.className = "expense-per-person";
  perPerson.textContent = `${money.format(math.budgeted / participantCount())} / persona`;
  amount.append(budgeted, perPerson);

  const actions = document.createElement("div");
  actions.className = "expense-actions";
  const status = document.createElement("button");
  status.type = "button";
  status.className = `expense-status ${expense.confirmed ? "is-confirmed" : "is-pending"}`;
  status.textContent = expense.confirmed ? "✓ Confirmado" : "✕ No confirmado";
  status.setAttribute("aria-pressed", String(expense.confirmed));
  status.addEventListener("click", () => {
    expense.confirmed = !expense.confirmed;
    saveState();
    renderAppCallback();
  });
  const edit = document.createElement("button");
  edit.type = "button";
  edit.textContent = "✎ Editar";
  edit.setAttribute("aria-label", `Editar ${type}`);
  edit.addEventListener("click", () => openExpenseDialog(expense));
  const remove = document.createElement("button");
  remove.type = "button";
  remove.textContent = "⌫ Eliminar";
  remove.setAttribute("aria-label", `Eliminar ${type}`);
  remove.addEventListener("click", () => {
    state.expenses = state.expenses.filter((item) => item.id !== expense.id);
    saveState();
    renderAppCallback();
  });
  actions.append(status, edit, remove);
  item.append(main, amount, actions);
  return { element: item, group: category?.group || "OTROS" };
}

export function renderExpenses() {
  const list = $("expenseList");
  list.replaceChildren();
  if (!state.expenses.length) {
    const empty = document.createElement("div");
    empty.className = "empty-expenses";
    const title = document.createElement("strong");
    title.textContent = "Tu lista empieza aquí";
    empty.append(title, document.createTextNode("Añade los gastos que ya conoces. Puedes completar el resto más adelante."));
    list.append(empty);
    return;
  }
  const groups = new Map();
  state.expenses.forEach((expense) => {
    const rendered = createExpenseElement(expense);
    if (!groups.has(rendered.group)) groups.set(rendered.group, []);
    groups.get(rendered.group).push(rendered.element);
  });
  const container = document.createElement("div");
  container.className = "expense-groups";
  groups.forEach((items, group) => {
    const section = document.createElement("section");
    const heading = document.createElement("h3");
    heading.className = "expense-group-title";
    heading.textContent = group;
    const groupList = document.createElement("div");
    groupList.className = "expense-group-list";
    groupList.append(...items);
    section.append(heading, groupList);
    container.append(section);
  });
  list.append(container);
}

function renderCategories() {
  const groups = $("categoryGroups");
  groups.replaceChildren();
  const selectedDefinition = ALL_CATEGORIES.find((category) => category.name === selectedCategory);
  const selectedArea = $("selectedCategoryArea");
  selectedArea.hidden = !selectedDefinition;
  if (selectedDefinition) {
    $("selectedCategoryGroup").textContent = `SELECCIONADO · ${selectedDefinition.group}`;
    $("selectedCategoryButton").textContent = selectedDefinition.name;
  }

  const categoriesByGroup = new Map();
  CATEGORIES.forEach((category) => {
    if (!categoriesByGroup.has(category.group)) categoriesByGroup.set(category.group, []);
    categoriesByGroup.get(category.group).push(category);
  });
  categoriesByGroup.forEach((categories, group) => {
    const section = document.createElement("section");
    section.className = "category-group";
    section.setAttribute("role", "group");
    const heading = document.createElement("h3");
    heading.className = "category-group-title";
    heading.textContent = group;
    const options = document.createElement("div");
    options.className = "category-group-options";
    categories.filter((category) => category.name !== selectedCategory).forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "category-option";
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", "false");
    button.textContent = category.name;
    button.addEventListener("click", () => selectCategory(category.name));
    options.append(button);
    });
    if (!options.childElementCount) {
      const note = document.createElement("p");
      note.className = "category-empty";
      note.textContent = "El tipo seleccionado aparece arriba.";
      options.append(note);
    }
    section.append(heading, options);
    groups.append(section);
  });
}

function selectCategory(category) {
  selectedCategory = category;
  renderCategories();
  $("expenseFields").hidden = false;
  $("saveExpense").hidden = false;
  $("dialogError").hidden = true;
  $("expensePrice").focus();
}

function openExpenseDialog(expense = null) {
  editingExpenseId = expense ? expense.id : null;
  selectedCategory = expense ? expense.type || expense.category : null;
  $("expenseForm").reset();
  $("dialogTitle").textContent = expense ? `Editar ${expense.type || expense.category}` : "¿Qué gasto quieres añadir?";
  $("expenseFields").hidden = !expense;
  $("saveExpense").hidden = !expense;
  $("dialogError").hidden = true;
  renderCategories();
  if (expense) {
    $("expenseDescription").value = expense.description;
    $("expensePrice").value = expense.price;
    $("expenseConfirmed").checked = expense.confirmed;
    document.querySelector(`input[name="expenseScope"][value="${expense.scope}"]`).checked = true;
  }
  $("expenseDialog").showModal();
  if (!expense) $("categoryGroups").querySelector(".category-option")?.focus();
}

function saveExpenseFromForm(event) {
  event.preventDefault();
  const price = Number($("expensePrice").value);
  if (!selectedCategory || !Number.isFinite(price) || price < 0) {
    $("dialogError").textContent = "Introduce un precio válido para guardar el gasto.";
    $("dialogError").hidden = false;
    return;
  }
  const category = ALL_CATEGORIES.find((item) => item.name === selectedCategory);
  if (!category) return;
  const expense = {
    id: editingExpenseId || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    category: category.group,
    type: category.name,
    description: $("expenseDescription").value.trim(),
    price,
    scope: document.querySelector('input[name="expenseScope"]:checked').value,
    confirmed: $("expenseConfirmed").checked
  };
  if (editingExpenseId) {
    state.expenses = state.expenses.map((item) => item.id === editingExpenseId ? expense : item);
  } else {
    state.expenses.push(expense);
  }
  saveState();
  $("expenseDialog").close();
  renderAppCallback();
}