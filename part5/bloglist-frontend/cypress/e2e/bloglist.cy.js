describe('Bloglist app', () => {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.request('POST', 'http://localhost:3001/api/users', {
      username: 'testuser',
      name: 'Test User',
      password: 'testpassword'
    })
    cy.visit('http://localhost:5173/')
  })

  it('login form is shown', function() {
    cy.contains('login')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', () => {
    it('succeeds with correct credentials', function() {
      cy.get('#username').should('be.visible').type('testuser')
      cy.get('#password').should('be.visible').type('testpassword')

      cy.get('#login-button').should('be.visible').click()

      cy.contains('Test User logged in')
    })

    it('fails with wrong password', function() {
      cy.get('#username').should('be.visible').type('testuser')
      cy.get('#password').should('be.visible').type('wrongpassword')

      cy.get('#login-button').should('be.visible').click()

      cy.contains('Wrong credentials')
    })
  })
})