import {
  getContainerEl, injectStylesBeforeElement, setupHooks, StyleOptions
} from "@cypress/mount-utils";
import { html, LitElement, render, TemplateResult } from "lit";
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

export interface MountOptions extends Partial<StyleOptions> {
  log?: boolean;
}

let componentInstance: LitElement | HTMLElement | undefined;

const cleanup = () => {
  componentInstance?.remove();
};

/**
 * Mounts a Lit element inside the Cypress browser
 *
 * @param {TemplateResult | string} Element Lit element being mounted
 * @param {MountReturn<T extends SvelteComponent>} options options to customize the element being mounted
 * @returns Cypress.Chainable<MountReturn>
 *
 * @example
 * import './Counter'
 * import { html } from 'lit'
 * import { mount } from 'cypress/lit'
 *
 * it('should render', () => {
 *   mount(html`<my-counter .count=${32}></my-counter>`)
 *   cy.get('my-element').shadow().get('button').contains(42)
 * })
 */
export function mount<T extends keyof HTMLElementTagNameMap>(
  Template: TemplateResult | string,
  options: MountOptions = {}
): Cypress.Chainable<{
  component: HTMLElementTagNameMap[T];
}> {
  return cy.then(() => {
    const target = getContainerEl();
    injectStylesBeforeElement(options, document, target);

    // If give a string set internal contents unsafely
    const element = typeof (Template) === 'string' ? html`${Template}`
      : Template

    /**
     * Render into the target with lit
     */
    render(element, target);

    /**
     * Using get will give default cypress timeouts for the element to register
     * onto the DOM and be ready for interaction.
     */
    return cy
      .get("[data-cy-root]")
      .children()
      .first()
      .then((element) => {
        const name = element.prop("tagName").toLowerCase();
        const el = document.getElementsByTagName<T>(name)[0];
        componentInstance = el;

        if (options.log !== false) {
          const mountMessage = `<${name} ... />`;

          Cypress.log({
            name: "mount",
            message: [mountMessage],
          })
            .snapshot("mounted")
            .end();
        }

        return cy.wrap({ component: el }, { log: false });
      });
  });
}

// Side effects from "import { mount } from '@cypress/<my-framework>'" are annoying, we should avoid doing this
// by creating an explicit function/import that the user can register in their 'component.js' support file,
// such as:
//    import 'cypress/<my-framework>/support'
// or
//    import { registerCT } from 'cypress/<my-framework>'
//    registerCT()
// Note: This would be a breaking change
setupHooks(cleanup);
