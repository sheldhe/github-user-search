describe("Navigation", () => {
  it("goes to home", () => {
    cy.visit("/");
    cy.contains("h1", "Home");
  });
});
