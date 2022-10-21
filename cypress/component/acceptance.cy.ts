import "../../src/my-element";
import { html } from "lit";

describe("Lit mount", () => {
  it("mounts", () => {
    cy.mount<"my-element">(html`<my-element></my-element>`);
    cy.get("my-element").shadow().contains("h1", "Count is 0");
  });

  it("reacts to state changes", () => {
    cy.mount(html`<my-element></my-element>`);

    cy.get("my-element").shadow().as("shadow");

    cy.get("@shadow").contains("h1", "Count is 0");
    cy.get("@shadow").find("button").click();
    cy.get("@shadow").contains("h1", "Count is 1");
  });

  it("accepts props", () => {
    cy.mount<"my-element">(html`<my-element .count=${42}></my-element>`);
    cy.get("my-element").shadow().as("shadow");

    cy.get("@shadow").contains("h1", "Count is 42");
  });

  it("can pass emitters as spies", () => {
    cy.mount<"my-element">(
      html`<my-element
        .count=${42}
        .clicked=${cy.spy().as("onClickedSpy")}
      ></my-element>`
    );

    cy.get("my-element").shadow().as("shadow");

    cy.get("@shadow").contains("h1", "Count is 42");
    cy.get("@shadow").find("button").click();
    cy.get("@onClickedSpy").should("have.been.calledWith", 42);
  });

  context("log", () => {
    it("displays component name in mount log", () => {
      cy.mount<"my-element">(html`<my-element .count=${42}></my-element>`);

      cy.wrap(Cypress.$(window.top.document.body)).within(() =>
        cy
          .contains("displays component name in mount log")
          .closest(".collapsible")
          .click()
          .within(() =>
            cy
              .get(".command-name-mount")
              .should("contain", "mount<my-element ... />")
          )
      );
    });

    it("does not display mount log", () => {
      cy.mount<"my-element">(html`<my-element .count=${42}></my-element>`, {
        log: false,
      });

      cy.wrap(Cypress.$(window.top.document.body)).within(() =>
        cy
          .contains("does not display mount log")
          .closest(".collapsible")
          .click()
          .within(() => cy.get(".command-name-mount").should("not.exist"))
      );
    });
  });
});
