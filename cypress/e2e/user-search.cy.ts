describe("User Search E2E", () => {
  it("search -> render -> infinite scroll -> sort change triggers new request", () => {
    // page=1
    cy.intercept("GET", "/api/github/search/users*page=1*", {
      fixture: "users-page1.json",
    }).as("page1");

    // page=2
    cy.intercept("GET", "/api/github/search/users*page=2*", {
      fixture: "users-page2.json",
    }).as("page2");

    // sort change (joined)
    cy.intercept("GET", "/api/github/search/users*sort=joined*", {
      fixture: "users-sorted-joined.json",
    }).as("sorted");

    cy.visit("/user-search");

    // Keyword 입력 후 Apply
    cy.get('input[label="Keyword"]').type("sheldhe");
    cy.contains("Apply").click();
    cy.wait("@page1");

    // URL에 반영됐는지
    cy.location("search").should("contain", "keyword=sheldhe");

    // 결과 표시
    cy.contains("u1"); // fixture에 있는 값

    // 무한스크롤 트리거: 페이지 아래로
    cy.scrollTo("bottom");
    cy.wait("@page2");
    cy.contains("u31"); // page2 fixture 첫번째 유저 등

    // 정렬 변경 → 새 요청(페이지 1 재조회)
    cy.contains("Sort").parent().click();
    cy.contains("joined").click();
    cy.wait("@sorted");
  });
});
