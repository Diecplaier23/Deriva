export function initializePreferenceMenu(menuId, onSelect) {
  const menu = document.getElementById(menuId);
  const trigger = menu.querySelector(".preference-trigger");
  const popup = menu.querySelector(".preference-options");
  const current = menu.querySelector(".preference-current");
  const options = Array.from(popup.querySelectorAll('[role="option"]'));

  function setValue(value) {
    const selected = options.find((option) => option.dataset.value === value);
    if (!selected) return;
    menu.dataset.value = value;
    current.textContent = selected.textContent.trim();
    options.forEach((option) => {
      const isSelected = option === selected;
      option.setAttribute("aria-selected", String(isSelected));
      option.tabIndex = isSelected ? 0 : -1;
    });
  }

  function close(restoreFocus = false) {
    popup.hidden = true;
    menu.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
    if (restoreFocus) trigger.focus();
  }

  function open() {
    document.querySelectorAll(".preference-menu").forEach((otherMenu) => {
      if (otherMenu !== menu) {
        otherMenu.querySelector(".preference-options").hidden = true;
        otherMenu.classList.remove("is-open");
        otherMenu.querySelector(".preference-trigger").setAttribute("aria-expanded", "false");
      }
    });
    popup.hidden = false;
    menu.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
    options.find((option) => option.getAttribute("aria-selected") === "true")?.focus();
  }

  trigger.addEventListener("click", () => {
    if (popup.hidden) open();
    else close();
  });
  trigger.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      open();
    } else if (event.key === "Escape" && !popup.hidden) {
      event.preventDefault();
      close(true);
    }
  });
  popup.addEventListener("keydown", (event) => {
    const focusedIndex = options.indexOf(document.activeElement);
    let nextIndex = focusedIndex;
    if (event.key === "ArrowDown") nextIndex = (focusedIndex + 1) % options.length;
    else if (event.key === "ArrowUp") nextIndex = (focusedIndex - 1 + options.length) % options.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = options.length - 1;
    else if (event.key === "Escape") {
      event.preventDefault();
      close(true);
      return;
    } else if (event.key === "Tab") {
      close();
      return;
    } else return;
    event.preventDefault();
    options[nextIndex].focus();
  });
  options.forEach((option) => option.addEventListener("click", () => {
    setValue(option.dataset.value);
    close(true);
    onSelect(option.dataset.value);
  }));
  document.addEventListener("pointerdown", (event) => {
    if (!menu.contains(event.target)) close();
  });
  menu.addEventListener("focusout", (event) => {
    if (!menu.contains(event.relatedTarget)) close();
  });

  setValue(menu.dataset.value);
  return setValue;
}