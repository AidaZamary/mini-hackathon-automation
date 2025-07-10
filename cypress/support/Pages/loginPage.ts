class LoginPage {
  visit() {
    cy.visit('https://my-shop-eight-theta.vercel.app/');
  }

  enterName(name) {
    cy.get('[id="username"]').should('be.visible').clear().type(name);
  }

   enterPassword(pass) {
    cy.get('[id="password"]').should('be.visible').clear().type(pass);
  }

  loginButton() {
    cy.get('button').contains('Login').click();
  }
}

export const loginPage = new LoginPage();
