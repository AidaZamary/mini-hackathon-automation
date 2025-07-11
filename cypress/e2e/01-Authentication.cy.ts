describe("Authentication Test Cases", () => {
  const baseUrl = "https://my-shop-eight-theta.vercel.app";
  const username = "alain";
  const password = "alain1234";

  it("TC001-Valid Login", () => {
    cy.visit(baseUrl);
    cy.get('input[id="username"]').type(username);
    cy.get('input[id ="password"]').type(password);
    cy.get("button").contains("Login").click();

    cy.url().should("include", "/items.html");
  });

  it("TC002-Invalid Login", () => {
    cy.visit(baseUrl);

    // Enter invalid username and valid password
    cy.get('input[id="username"]').type("wrong");
    cy.get('input[id="password"]').type("alain1234");
    cy.contains("button", "Login").click();

    // Assert error message is shown
     cy.on("window:alert", (text) => {
      expect(text).to.equal("Invalid login");
    });
  });

  it("TC003-Invalid Password", () => {
    cy.visit(baseUrl);

    // Enter valid username and invalid password
    cy.get('input[id="username"]').type("alain");
    cy.get('input[id="password"]').type("wrong123");
    cy.contains("button", "Login").click();

    cy.on("window:alert", (text) => {
      expect(text).to.equal("Invalid login");
    });
  });

  it("TC004-Empty Credentials", () => {
    cy.visit(baseUrl);

    // Leave username and password blank, click Login
    cy.contains("button", "Login").click();

    // Assert validation messages are shown
   cy.on("window:alert", (text) => {
      expect(text).to.equal("Invalid login");
    });
  });

  it("TC005-Password Field Masking", () => {
    cy.visit(baseUrl);

    // Check that the password field has type="password"
    cy.get('input[id="password"]').should("have.attr", "type", "password");

    // Optionally, type a password and ensure it remains masked
    cy.get('input[id="password"]').type("alain1234");
    cy.get('input[id="password"]').should("have.value", "alain1234");
    cy.get('input[id="password"]')
      .invoke("attr", "type")
      .should("eq", "password");
  });
});
