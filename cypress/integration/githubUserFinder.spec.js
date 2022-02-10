/// <reference types="cypress" />

describe('GitHub User Finder ', () => {
    beforeEach(() => {
        cy.intercept(
            'GET',
            'https://api.github.com/users/Lay-RosaLauren',
            { fixture: 'user' }
        ).as('getUser')
        cy.intercept(
            'GET',
            'https://api.github.com/users/Lay-RosaLauren/repos?page=1&per_page=4',
            { fixture: 'repos'}
        ).as('getUserRepos')    
        cy.visit('/')
        cy.get('input[type="text"]').type('Lay-RosaLauren{enter}')
        cy.wait('@getUser')
        cy.wait('@getUserRepos')
    })

    Cypress._.times(3, () => {
      it('finds user repos', () => {
        cy.contains('h1', 'Lay-RosaLauren').should('be.visible')
      })
    })
});