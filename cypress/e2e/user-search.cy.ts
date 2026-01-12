describe("User Search (E2E)", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/github/search/users*", (req) => {
      const page = (req.query.page as string) ?? "1";

      if (page === "1") {
        return req.reply({ fixture: "users_page1.json" });
      }

      if (page === "2") {
        return req.reply({ fixture: "users_page2.json" });
      }

      return req.reply({ fixture: "users_page1.json" });
    }).as("searchUsers");
  });

  it("검색어 입력 후 결과를 렌더링한다 (검색 쿼리)", () => {
    cy.visit("/");

    cy.get('[data-cy="keyword"]').clear().type("sheldhe");
    cy.get('[data-cy="apply"]').click();

    cy.wait("@searchUsers");

    cy.get('[data-cy="user-card"]').should("have.length.at.least", 1);

    cy.contains("sheldhe").should("be.visible");
  });

  it("Load more 클릭 시 다음 페이지를 요청한다 (페이징 로직)", () => {
    cy.visit("/");

    cy.get('[data-cy="keyword"]').clear().type("sheldhe");
    cy.get('[data-cy="apply"]').click();
    cy.wait("@searchUsers");

    // page 1
    cy.get('[data-cy="user-card"]').should("have.length", 2);

    // page 2
    cy.get('[data-cy="load-more"]').click();
    cy.wait("@searchUsers");

    cy.get('[data-cy="user-card"]').should("have.length", 2);
  });

  it("키워드가 없으면 검색 버튼이 비활성화된다", () => {
    cy.visit("/");

    cy.get('[data-cy="keyword"]').clear();
    cy.get('[data-cy="apply"]').should("be.disabled");
  });

  it("SSR 초기 데이터가 CSR에서 정상 렌더링된다 (SSR / CSR 경계)", () => {
    cy.visit("/");

    cy.get('[data-cy="user-card"]').should("exist");
  });
});
