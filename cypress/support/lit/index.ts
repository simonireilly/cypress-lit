import { getContainerEl } from '@cypress/mount-utils';
import { LitElement, render, TemplateResult } from 'lit';

export const mount = (_element: LitElement, template: TemplateResult) => {
  const target = getContainerEl();

  render(template, target);

  return cy
    .wait(0, { log: false })
    .then(() => {
      const mountMessage = `<${String(_element.constructor.name)} ... />`;

      Cypress.log({
        name: 'mount',
        message: [mountMessage],
      })
        .snapshot('mounted')
        .end();
    })
    .get('[data-cy-root]')
    .children()
    .first()
    .shadow();
};
