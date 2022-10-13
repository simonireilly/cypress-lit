import { html } from "lit";
import { MyElement } from "../../src/my-element";

describe("my-element.cy.ts", () => {
  it("playground", () => {
    cy.mount(new MyElement(), html`<my-element></my-element>`).as("element");

    cy.get("@element").contains("count").click();
  });
});
