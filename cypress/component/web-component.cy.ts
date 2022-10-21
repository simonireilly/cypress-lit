import "../../src";
import { WebCounter } from "../../src";

describe("Web Component mount", () => {
  it("mounts", () => {
    cy.mount<"my-paragraph">(`<my-paragraph></my-paragraph>`);
    cy.get("my-paragraph").shadow().contains("h1", "Count is 0");
  });

  it("reacts to state changes", () => {
    cy.mount<'my-paragraph'>(`<my-paragraph></my-paragraph>`);

    cy.get("my-paragraph").shadow().as("shadow");

    cy.get("@shadow").contains("h1", "Count is 0");
    cy.get("@shadow").find("button").click();
    cy.get("@shadow").contains("h1", "Count is 1");
  });

  it("accepts props", () => {
    cy.mount<"my-paragraph">(`<my-paragraph .count=${42}></my-paragraph>`);
    cy.get("my-paragraph").shadow().as("shadow");

    cy.get("@shadow").contains("h1", "Count is 42");
  });

  it("can pass emitters as spies", () => {
    cy.mount<"my-paragraph">(
      `<my-paragraph
        .count=${42}
        .clicked=${cy.spy().as("onClickedSpy")}
      ></my-paragraph>`
    );

    cy.get("my-paragraph").shadow().as("shadow");

    cy.get("@shadow").contains("h1", "Count is 42");
    cy.get("@shadow").find("button").click();
    cy.get("@onClickedSpy").should("have.been.calledWith", 42);
  });

  describe("slotting", () => {
    it("can slot HTMLElements", () => {
      cy.mount<"my-paragraph">(
        `<my-paragraph
          .count=${42}
          .clicked=${cy.spy().as("onClickedSpy")}
        >
          <div class="div-slotted">
            <p>Rendered</p>
          </div>
        </my-paragraph>`
      );

      cy.get("my-paragraph").shadow().as("shadow");

      cy.get("@shadow").get(".div-slotted").find('p').contains('Rendered')
    })

    it("can slot other web components", () => {
      cy.mount<"my-paragraph">(
        `<my-paragraph
          .count=${42}
          .clicked=${cy.spy().as("onClickedSpy")}
        >
          <my-paragraph .count=${99}></my-paragraph>
        </my-paragraph>`
      );

      cy.get("my-paragraph").shadow().as("shadow");
      cy.get("@shadow").contains("h1", "Count is 42");
      cy.get('@shadow').get('my-paragraph').shadow().contains("h1", "Count is 99");
    })
  })


  describe('wrapping', () => {
    it('component is instance of web component', () => {
      cy.mount<'my-paragraph'>(`<my-paragraph></my-paragraph>`).then(({ component }) => {
        expect(component).to.be.instanceOf(WebCounter)
      })
    })
  })

  context("log", () => {
    it("displays component name in mount log", () => {
      cy.mount<"my-paragraph">(`<my-paragraph .count=${42}></my-paragraph>`);

      cy.wrap(Cypress.$(window.top.document.body)).within(() =>
        cy
          .contains("displays component name in mount log")
          .closest(".collapsible")
          .click()
          .within(() =>
            cy
              .get(".command-name-mount")
              .should("contain", "mount<my-paragraph ... />")
          )
      );
    });

    it("does not display mount log", () => {
      cy.mount<"my-paragraph">(`<my-paragraph .count=${42}></my-paragraph>`, {
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
