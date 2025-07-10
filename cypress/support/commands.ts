// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { loginPage } from "./Pages/loginPage";

declare global {
  namespace Cypress {
    interface Chainable {
      loginUser(): Chainable<Element>;
      logoutUser(): Chainable<Element>;
    }
  }
}

Cypress.Commands.add('loginUser', () => {
  const username = Cypress.env('username');
  const password = Cypress.env('password');

  if (!username || !password) {
    throw new Error('Cypress environment variables "username" and "password" are not set. Please check cypress.env.json or your Cypress configuration.');
  }

  loginPage.visit();
  loginPage.enterName(username);
  loginPage.enterPassword(password);
  loginPage.loginButton();
});

Cypress.Commands.add('logoutUser', () => {
  // Clear all cookies to ensure a clean session state
  cy.clearCookies();
  // Clear all local storage data
  cy.clearLocalStorage();

  cy.visit('https://my-shop-eight-theta.vercel.app/');
});