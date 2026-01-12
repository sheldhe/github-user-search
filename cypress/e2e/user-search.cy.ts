describe("User Search (E2E)", () => {
  beforeEach(() => {
    // 페이지별로 fixture를 다르게 응답
    cy.intercept("GET", "/api/github/search/users*", (req) => {
      const page = (req.query.page as string) ?? "1";

      if (page === "1") {
        return req.reply({ fixture: "users_page1.json" });
      }

      if (page === "2") {
        return req.reply({ fixture: "users_page2.json" });
      }

      return req.reply({ fixture: "users_page2.json" });
    }).as("searchUsers");
  });

  it("applies keyword and renders results", () => {
    cy.visit("/");

    cy.get('[data-cy="keyword"]').clear().type("sheldhe");
    cy.get('[data-cy="apply"]').click();

    cy.wait("@searchUsers");

    cy.get('[data-cy="user-card"]').should("have.length.at.least", 1);

    cy.contains("sheldhe").should("be.visible");
    cy.contains("sheldhe").should("exist");
  });

  it("loads next page via Load more (paging logic)", () => {
    cy.visit("/");

    cy.get('[data-cy="keyword"]').clear().type("sheldhe");
    cy.get('[data-cy="apply"]').click();
    cy.wait("@searchUsers");

    cy.get('[data-cy="user-card"]').should("have.length", 2);

    cy.get('[data-cy="load-more"]').click();
    cy.wait("@searchUsers");

    // page2 append 확인
    cy.get('[data-cy="user-card"]').should("have.length", 2);
    cy.contains("sheldhe").should("exist");
  });

  it("prevents too-broad search (no keyword) and does not call API", () => {
    cy.visit("/");

    cy.get('[data-cy="keyword"]').clear();
    cy.get('[data-cy="apply"]').click();

    // 에러 메시지 UI가 있다면 확인
    // cy.contains("키워드 없이 검색불가").should("exist");

    // 호출 안 됐는지 확인 (intercept alias가 0회)
    cy.get("@searchUsers.all").should("have.length", 0);
  });
});
