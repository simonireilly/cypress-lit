# cypress-lit

A cypress with lit example that works for component testing.

- [cypress-lit](#cypress-lit)
  - [Examples](#examples)
    - [With Lit HTML](#with-lit-html)
    - [With String](#with-string)
  - [Running](#running)
  - [Setup](#setup)

## Examples

### With Lit HTML

You can pass a hit template directly to the mount command.

```ts
// ./cypress/component/lit.cy.ts#L1-L9

import "../../src";
import { html } from "lit";
import { LitCounter } from "../../src/counter-lit";

describe("Lit mount", () => {
  it("mounts", () => {
    cy.mount<"counter-lit">(html`<counter-lit></counter-lit>`);
    cy.get("counter-lit").shadow().contains("h1", "Count is 0");
  });
```

### With String

If you have custom elements defined using pure browser javascript then you can pass in a string.

```ts
// ./cypress/component/web-component.cy.ts#L1-L9

import "../../src";
import { WebCounter } from "../../src";

describe("Web Component mount", () => {
  it("mounts", () => {
    cy.mount<"counter-wc">(`<counter-wc></counter-wc>`);
    cy.get("counter-wc").shadow().contains("h1", "Count is 0");
  });

```

When using custom elements and you need to access the element to set non-string attributes you can do this using the properties option:

```ts
// ./cypress/component/lit.cy.ts#L26-L39

;

("can pass emitters as spies", () => {
cy.mount<"counter-lit">(
  html`<counter-lit
    .count=${42}
    .clicked=${cy.spy().as("onClickedSpy")}
  ></counter-lit>`
);

cy.get("counter-lit").shadow().as("shadow");

cy.get("@shadow").contains("h1", "Count is 42");
cy.get("@shadow").find("button").click();
```

This enables passing spies and other overrides for testing purposes.

## Running

```
yarn

yarn run cypress --component
```

## Setup

To do this in your project follow the component test wizard for cypress, I recommend selecting svelte - but skip installing that framework.

After that you can add the mount command I have written [./cypress/support/lit/index.t](./cypress/support/lit/index.ts)
