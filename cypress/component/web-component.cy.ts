import '../../src'

describe("Lit mount", () => {
  it("mounts", () => {
    cy.mount<"my-paragraph">(`<my-paragraph></my-paragraph>`);
    cy.get("my-element").shadow().contains("h1", "Count is 0");
  });
})
