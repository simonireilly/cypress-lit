# cypress-lit

A cypress with web components that works for lit elements and custom elements registered with pure JS.

- [cypress-lit](#cypress-lit)
  - [Installation](#installation)
  - [Examples](#examples)
    - [With Lit HTML](#with-lit-html)
    - [With Native WebComponents](#with-native-webcomponents)
  - [Contributing](#contributing)

## Installation

```bash
npm i -D @cypress-lit/mount
yarn i -D @cypress-lit/mount
pnpm i -D @cypress-lit/mount
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
