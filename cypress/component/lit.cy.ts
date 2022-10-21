import "../../src";
import { html } from "lit";
import { MyElement } from "../../src/my-element";

describe("Lit mount", () => {
  it("mounts", () => {
    cy.mount<"my-element">(html`<my-element></my-element>`);
    cy.get("my-element").shadow().contains("h1", "Count is 0");
  });

  it("reacts to state changes", () => {
    cy.mount<'my-element'>(html`<my-element></my-element>`);

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

  describe("slotting", () => {
    it("can slot HTMLElements", () => {
      cy.mount<"my-element">(
        html`<my-element
          .count=${42}
          .clicked=${cy.spy().as("onClickedSpy")}
        >
          <div class="div-slotted">
            <p>Rendered</p>
          </div>
        </my-element>`
      );

      cy.get("my-element").shadow().as("shadow");

      cy.get("@shadow").get(".div-slotted").find('p').contains('Rendered')
    })

    it("can slot other web components", () => {
      cy.mount<"my-element">(
        html`<my-element
          .count=${42}
          .clicked=${cy.spy().as("onClickedSpy")}
        >
          <my-element .count=${99}></my-element>
        </my-element>`
      );

      cy.get("my-element").shadow().as("shadow");
      cy.get("@shadow").contains("h1", "Count is 42");
      cy.get('@shadow').get('my-element').shadow().contains("h1", "Count is 99");
    })
  })


  describe('wrapping', () => {
    it('component is instance of web component', () => {
      cy.mount<'my-element'>(html`<my-element></my-element>`).then(({ component }) => {
        expect(component).to.be.instanceOf(MyElement)
      })
    })
  })

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
