# cypress-lit

[![NPM Version](https://img.shields.io/npm/v/cypress-lit.svg?style=for-the-badge&labelColor=000000)](https://www.npmjs.com/package/cypress-lit)

Running cypress component testing on web components and lit elements.

- [cypress-lit](#cypress-lit)
  - [Installation](#installation)
    - [Setup](#setup)
  - [Examples](#examples)
    - [With Lit HTML](#with-lit-html)
    - [With Native WebComponents](#with-native-webcomponents)
  - [Contributing](#contributing)

> The below gif is slowed by 10x so you don't miss it 🐢

![Cypress runner showing a component test of a lit element](https://user-images.githubusercontent.com/30017294/201855728-a49d5fef-06f7-4c2c-a0d7-f6027e0135d4.gif)

## Installation

```bash
npm i -D cypress-lit
yarn add -D cypress-lit
pnpm i -D cypress-lit
```

### Setup

The command needs to be imported from the package and added to cypress commands.

```ts
# ./cypress/support/component.ts

import "./commands";

import { mount } from "cypress-lit";

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add("mount", mount);
```

When running cypress components testing you will need to specify a custom dev server. This project has tests that use the below configuration.

```ts
// ./cypress.config.ts

import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    supportFile: "cypress/support/component.ts",
    devServer: {
      bundler: "vite",
    },
    indexHtmlFile: "cypress/support/component-index.html",
  },
  experimentalWebKitSupport: true,
});
```

## Examples

There is a collection of tests for:

- [Lit Element](./cypress/component/lit.cy.ts)
- [Pure custom elements](./cypress/component/web-component.cy.ts)

### With Lit HTML

You can pass a hit template directly to the mount command.

```ts
// ./cypress/component/lit.cy.ts#L1-L9

import "../../templates/index.css";
import { html } from "lit";
import { LitCounter } from "../../templates/counter-lit";

describe("Lit mount", () => {
  it("mounts", () => {
    cy.mount<"counter-lit">(html`<counter-lit></counter-lit>`);
    cy.get("counter-lit").shadow().contains("h1", "Count is 0");
  });
```

### With Native WebComponents

If you have custom elements defined using pure browser javascript then you can pass in a string.

```ts
// ./cypress/component/web-component.cy.ts#L1-L9

import "../../templates/index.css";
import { WebCounter } from "../../templates";

describe("Web Component mount", () => {
  it("mounts", () => {
    cy.mount<"counter-wc">(`<counter-wc></counter-wc>`);
    cy.get("counter-wc").shadow().contains("h1", "Count is 0");
  });

```

When using custom elements and you need to access the element to set non-string attributes you can do this using the properties option:

```ts
// ./cypress/component/web-component.cy.ts#L26-L39

it("can pass emitters as spies", () => {
  cy.mount<"counter-wc">(
    `<counter-wc
      count=${42}
    ></counter-wc>`,
    { properties: { clicked: cy.spy().as("onClickedSpy") } }
  );

  cy.get("counter-wc").shadow().as("shadow");

  cy.get("@shadow").contains("h1", "Count is 42");
  cy.get("@shadow").find("button").click();
  cy.get("@onClickedSpy").should("have.been.calledWith", 42);
});
```

This enables passing spies and other overrides for testing purposes.

## Contributing

- Open an issue or a PR with some comments to discuss the feat/fix
