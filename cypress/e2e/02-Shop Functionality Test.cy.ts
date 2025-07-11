describe("Shop Functionality Test", () => {
  const baseUrl = "https://my-shop-eight-theta.vercel.app";
  const username = "alain";
  const password = "alain1234";

  beforeEach(() => {
    cy.visit(baseUrl);
    cy.get('input[id="username"]').type(username);
    cy.get('input[id ="password"]').type(password);
    cy.get("button").contains("Login").click();
  });

  it("TC006-Product Display", () => {
    // Check that at least one product exists
    cy.get(".item").should("exist");

    // Get list of data-name for the products and verify each is visible
    cy.get(".item").each(($el) => {
      const productName = $el.attr("data-name");
      expect(productName).to.exist;
      cy.wrap($el)
        .should("be.visible")
        .and("have.attr", "data-name", productName);
    });
  });

  it("TC007-Add Product to Cart", () => {
    // Check that at least one product exists
    cy.get(".item").should("exist");

    // For the first product, add to cart by interacting with checkbox, size, and quantity
    cy.get(".item")
      .first()
      .within(() => {
        // Click the checkbox to select the product
        cy.get('input[type="checkbox"]').check();

        // Select a size (select the first available option that is not disabled)
        cy.get(".size-selector")
          .find("option:not([disabled])")
          .eq(0)
          .then((option) => {
            cy.get(".size-selector").select(option.val() as string);
          });

        // Set quantity to 2
        cy.get(".quantity-input").clear().type("2");

        // Validate the min value must be more than 1
        cy.get(".quantity-input")
          .invoke("attr", "min")
          .then((min) => {
            expect(Number(min)).to.be.greaterThan(0);
          });
      });

    // Click the "Proceed to Checkout" button
    cy.contains("button", "Proceed to Checkout").click();

    // Wait for the customer modal to appear and fill in the details
    cy.get("#customerModal").should("be.visible");
    cy.get("#customerName").type("John Doe");
    cy.get("#customerPhone").type("0123456789");
    cy.get("#customerAddress").type("123 Main Street, City, Country");
    cy.get('[id="proceedBtn"]').contains("Proceed").click({ force: true });
    cy.get('[id="confirmYes"]')
      .invoke("removeAttr", "target")
      .click({ force: true });

    // Validate the URL includes /summary.html
    cy.url().should("include", "/summary.html");
  });

  it("TC008-Add Multiple Products and Validate Summary", () => {
    // Ensure at least two products exist
    cy.get(".item").should("have.length.greaterThan", 1);

    // Add the first two products to cart
    cy.get(".item").each(($el, index) => {
      if (index < 2) {
        cy.wrap($el).within(() => {
          cy.get('input[type="checkbox"]').check();

          // Select a size if available
          cy.get(".size-selector")
            .find("option:not([disabled])")
            .eq(0)
            .then((option) => {
              cy.get(".size-selector").select(option.val() as string);
            });

          // Set quantity to 2
          cy.get(".quantity-input").clear().type("2");

          // Validate min value > 0
          cy.get(".quantity-input")
            .invoke("attr", "min")
            .then((min) => {
              expect(Number(min)).to.be.greaterThan(0);
            });
        });
      }
    });

    // Click the "Proceed to Checkout" button
    cy.contains("button", "Proceed to Checkout").click();

    // Wait for the customer modal to appear and fill in the details
    const name = "Jane Smith";
    const phone = "0987654321";
    const address = "456 Another Street, City, Country";
    cy.get("#customerModal").should("be.visible");
    cy.get("#customerName").type(name);
    cy.get("#customerPhone").type(phone);
    cy.get("#customerAddress").type(address);
    cy.get('[id="proceedBtn"]').contains("Proceed").click({ force: true });
    cy.get('[id="confirmYes"]')
      .invoke("removeAttr", "target")
      .click({ force: true });

    // Validate the URL includes /summary.html
    cy.url().should("include", "/summary.html");

    // Validate the summary page contains the same customer details
    cy.get("#customerDetails").should("contain", name);
    cy.get("#customerDetails").should("contain", phone);
    cy.get("#customerDetails").should("contain", address);
  });

  it("TC009-Validate Cart Price Calculation for Multiple Products", () => {
    // Ensure at least two products exist
    cy.get(".item").should("have.length.greaterThan", 1);

    let expectedTotal = 0;

    // Add the first two products to cart and calculate expected total
    cy.get(".item").each(($el, index) => {
      if (index < 2) {
        cy.wrap($el).within(() => {
          cy.get('input[type="checkbox"]').check();

          // Select a size if available
          cy.get(".size-selector")
            .find("option:not([disabled])")
            .eq(0)
            .then((option) => {
              cy.get(".size-selector").select(option.val() as string);
            });

          // Set quantity to 2
          cy.get(".quantity-input").clear().type("2");

          // Calculate expected total for this product
          cy.get(".quantity-input").invoke("val").then((qty) => {
            const quantity = Number(qty);
            const price = Number($el.attr("data-price"));
            expectedTotal += price * quantity;
          });
        });
      }
    });

    // Click the "Proceed to Checkout" button
    cy.contains("button", "Proceed to Checkout").click();

    // Fill in customer details and proceed
    cy.get("#customerModal").should("be.visible");
    cy.get("#customerName").type("Cart Tester");
    cy.get("#customerPhone").type("0112233445");
    cy.get("#customerAddress").type("789 Cart Street, City, Country");
    cy.get('[id="proceedBtn"]').contains("Proceed").click({ force: true });
    cy.get('[id="confirmYes"]')
      .invoke("removeAttr", "target")
      .click({ force: true });

    // Validate the URL includes /summary.html
    cy.url().should("include", "/summary.html");

    // Validate the total price in the summary matches the expected total
    cy.get("#totalPrice, .total-price").invoke("text").then((text) => {
      // Remove any currency symbols and whitespace
      const displayedTotal = Number(text.replace(/[^\d.]/g, ""));
      expect(displayedTotal).to.eq(expectedTotal);
    });
  });

  it("TC010-Proceed Payment ", () => {
    // Ensure at least two products exist
    cy.get(".item").should("have.length.greaterThan", 1);

    // Add the first two products to cart
    cy.get(".item").each(($el, index) => {
      if (index < 2) {
        cy.wrap($el).within(() => {
          cy.get('input[type="checkbox"]').check();

          // Select a size if available
          cy.get(".size-selector")
            .find("option:not([disabled])")
            .eq(0)
            .then((option) => {
              cy.get(".size-selector").select(option.val() as string);
            });

          // Set quantity to 2
          cy.get(".quantity-input").clear().type("2");

          // Validate min value > 0
          cy.get(".quantity-input")
            .invoke("attr", "min")
            .then((min) => {
              expect(Number(min)).to.be.greaterThan(0);
            });
        });
      }
    });

    // Click the "Proceed to Checkout" button
    cy.contains("button", "Proceed to Checkout").click();

    // Wait for the customer modal to appear and fill in the details
    cy.get("#customerModal").should("be.visible");
    cy.get("#customerName").type("Jane Smith");
    cy.get("#customerPhone").type("0987654321");
    cy.get("#customerAddress").type("456 Another Street, City, Country");
    cy.get('[id="proceedBtn"]').contains("Proceed").click({ force: true });
    cy.get('[id="confirmYes"]')
      .invoke("removeAttr", "target")
      .click({ force: true });

    // Validate the URL includes /summary.html
    cy.url().should("include", "/summary.html");

     // Validate the summary page contains the same customer details
    cy.get("#customerDetails").should("contain", 'Jane Smith');
    cy.get("#customerDetails").should("contain", '0987654321');
    cy.get("#customerDetails").should("contain", '456 Another Street, City, Country');

    cy.get('[class="btn-confirm"]').should('be.enabled').invoke("removeAttr", "target").click();


    cy.url().should("include", "/payment.html");
  });
});
