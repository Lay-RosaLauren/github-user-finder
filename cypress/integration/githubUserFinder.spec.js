/// <reference types="cypress" />

describe("GitHub User Finder ", () => {
  context("No errors", () => {
    const repos = require("../fixtures/repos.json");

    beforeEach(() => {
      cy.intercept("GET", "https://api.github.com/users/Lay-RosaLauren", {
        fixture: "user",
      }).as("getUser");
      cy.intercept(
        "GET",
        "https://api.github.com/users/Lay-RosaLauren/repos?page=1&per_page=4",
        { fixture: "repos" }
      ).as("getRepos");
      cy.visit("/");
      cy.get('input[type="text"]')
        .type("Lay-RosaLauren{enter}")
        .as("userInputField");
      cy.wait("@getUser");
      cy.wait("@getRepos");
      cy.wait("@getRepos");
    });

    Cypress._.times(1, () => {
      it("finds user repos", () => {
        const { name } = require("../fixtures/user.json");
        cy.contains("h1", "Lay-RosaLauren").should("be.visible");
      });
    });
    it("github user finder", () => {
      cy.get(".sc-iqseJM > svg").should("be.visible");
    });
    it("goes back to the homepage", () => {
      cy.get(".arrow_svg__feather").click();
      cy.contains("button", "Pesquisar").should("be.visible");
      //cy.url().should('be.equal', `${Cypress.config('baseUrl')}/`)
      cy.get("@userInputField").should("be.visible");
    });
  });

  context("Error scenarios", () => {
    it("erros when rate limit is exceeded and redirects to the homepage", () => {
      cy.intercept("GET", "https://api.github.com/users/Lay-RosaLauren", {
        statusCode: 403,
      }).as("getUser");
      cy.visit("/");
      cy.get('input[type="text"]#user')
        .as("userInputField")
        .type("Lay-RosaLauren{enter}");
      cy.wait("@getUser");

      cy.contains("Erro")
        .should("be.visible")
        .parent()
        .find("p")
        .should("have.text", "Usuário não encontrado. Redirecionando...");
      cy.get("header")
        .next()
        .find("main main:contains(Usuário não encontrado)")
        .should("have.length", 3)
        .and("be.visible");

      //cy.url().should('be.equal', `${Cypress.config('baseUrl')}/`)
      cy.get("@userInputField").should("be.visible");
    });
  });
});
