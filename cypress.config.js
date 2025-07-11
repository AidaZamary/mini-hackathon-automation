const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: 'cypress-allure-plugin',
  reporterOptions: {
    outputDir: 'allure-results',
    cleanResults: true,
    overwrite: false
  },
  e2e: {
    setupNodeEvents(on, config) {
      require('@shelex/cypress-allure-plugin/writer')(on, config);
      return config;
    }
  }
});
