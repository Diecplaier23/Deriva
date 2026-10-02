export function createPersonId() {
  return `person-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createInitialState() {
  return {
    destination: "",
    savings: "",
    safetyMargin: 10,
    calculationMode: "automatic",
    people: [{ id: createPersonId(), name: "", contribution: "", paid: false }],
    expenses: []
  };
}

export let state = createInitialState();

export function setState(nextState) {
  state = nextState;
}