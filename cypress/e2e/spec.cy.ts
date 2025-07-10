describe('Mini Hackathon - Login Test', () => {
    beforeEach(() => {
        cy.loginUser();
    });

    it('1 Purchase buy T-shirt', () => {
        cy.get('[type="checkbox"]').first().check();
        cy.get('[class="size-selector"]').first().select('M');
        cy.get('[type="submit"]').contains('Proceed to Checkout').click();
        cy.logoutUser();
    });

    it('1 Purchase buy Perfume', () => {
        cy.get('[type="checkbox"]').eq(3).check();
        cy.get('[type="submit"]').contains('Proceed to Checkout').click();
        cy.logoutUser();
    });

});