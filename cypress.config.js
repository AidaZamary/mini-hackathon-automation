const { defineConfig } = require("cypress");
const mochawesome = require('cypress-mochawesome-reporter/plugin');

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports/mochawesome',
    overwrite: false,
    html: false,
    json: true
  },
  e2e: {
    setupNodeEvents(on, config) {
      mochawesome(on); // ✅ Required for reporter to work
      return config;
    }
  }
});
