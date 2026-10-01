export function createInitialState() {
  return {
    destination: "",
    savings: "",
    safetyMargin: 10,
    calculationMode: "automatic",
    people: [{ name: "", contribution: "", paid: false }],
    expenses: []
  };
}

export let state = createInitialState();

export function setState(nextState) {
  state = nextState;
}