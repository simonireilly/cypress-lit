import '../../src'

describe("Web Component mount", () => {
  it("mounts", () => {
    cy.mount<"my-paragraph">(`<my-paragraph></my-paragraph>`);
    cy.get("my-paragraph").shadow().contains("h1", "Count is 0");
  });
})
