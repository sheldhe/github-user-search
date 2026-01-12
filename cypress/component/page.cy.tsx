describe("Home Page", () => {
  it("renders search UI", () => {
    cy.visit("/");
    cy.get('[data-testid="user-search-client"]').should("be.visible");
  });
});
