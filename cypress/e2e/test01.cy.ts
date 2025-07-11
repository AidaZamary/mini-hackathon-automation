describe("Items Page Tests - My Shop", () => {
  const baseUrl = "https://my-shop-eight-theta.vercel.app";
  const username = "alain";
  const password = "alain1234";

  it("TC001", () => {
    cy.visit(baseUrl);
    cy.get('input[id="username"]').type(username);
    cy.get('input[id ="password"]').type(password);
    cy.get('button').contains('Login').click();

    cy.url().should("include", "/items.html");
  });

  it("TC002", () => {
    cy.visit('https://my-shop-eight-theta.vercel.app/');

    // Enter invalid username and valid password
    cy.get('input[id="username"]').type('wrong');
    cy.get('input[id="password"]').type('alain1234');
    cy.contains('button', 'Login').click();

    // Assert error message is shown
    cy.contains('Invalid username or password').should('be.visible');
  });

});
