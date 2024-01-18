import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:5173',
    defaultCommandTimeout: 10000, // Time to wait for most Cypress commands to complete
    pageLoadTimeout: 60000,       // Time to wait for page transition events or `cy.visit()` commands
    requestTimeout: 5000,         // Time to wait for `cy.request()` commands to complete
    responseTimeout: 30000,       // Time to wait for a response to a `cy.visit()`, `cy.request()`, `cy.route()` commands
  },
  env: {
    BACKEND: 'http://localhost:3001/api'
  },
});
