import { html } from "lit";
import "../../src/my-element";

describe("my-element.cy.ts", () => {
  it("playground", () => {
    cy.mount<"my-element">(html`<my-element></my-element>`);

    cy.get("my-element").shadow().contains("Count is 0");
    cy.get("my-element").shadow().contains("Add more").click();
    cy.get("my-element").shadow().contains("Count is 1");
  });
});
