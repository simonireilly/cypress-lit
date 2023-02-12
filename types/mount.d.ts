/// <reference types="cypress" />
/// <reference types="cypress" />
/// <reference types="cypress" />
/// <reference types="cypress" />
/// <reference types="cypress" />
/// <reference types="cypress" />
import { type StyleOptions } from "@cypress/mount-utils";
import { type TemplateResult } from "lit";
interface MountOptions<T extends HTMLElement> extends Partial<StyleOptions> {
    log?: boolean;
    properties?: Partial<T>;
}
export declare const mount: <T extends keyof HTMLElementTagNameMap>(template: TemplateResult | string, options?: MountOptions<HTMLElementTagNameMap[T]>) => Cypress.Chainable<JQuery<HTMLElementTagNameMap[T]>>;
export {};
