describe('Bloglist app', () => {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, {
      username: 'testuser',
      name: 'Test User',
      password: 'testpassword'
    })
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, {
      username: 'testuser2',
      name: 'Test User 2',
      password: 'testpassword2'
    })
    cy.visit('')
  })

  it('login form is shown by default', function() {
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

  describe('When logged in', () => {
    beforeEach(function() {
      cy.login({ username: 'testuser', password: 'testpassword' })
    })

    it('a new blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title-input').type('Test blog 1')
      cy.get('#author-input').type('Test author 1')
      cy.get('#url-input').type('http://testurl1.com')
      cy.get('#create-blog-button').click()

      cy.contains('Test blog 1 Test author 1')
    })

    describe('and several blogs exists', () => {
      beforeEach(function() {
        cy.createBlog({
          title: 'Test blog 1',
          author: 'Test author 1',
          url: 'https://testurl1.com',
          likes: 1
        })
        cy.createBlog({
          title: 'Test blog 2',
          author: 'Test author 2',
          url: 'https://testurl2.com',
          likes: 10
        })
        cy.createBlog({
          title: 'Test blog 3',
          author: 'Test author 3',
          url: 'https://testurl3.com',
          likes: 100
        })
      })

      it('a blog can be liked', function() {
        cy.contains('Test blog 2 Test author 2').contains('view').click()
        cy.contains('Test blog 2 Test author 2').contains('like').click()

        cy.contains('Test blog 2 Test author 2').contains('likes 11')
      })

      it('a blog can be deleted by the user who created it', function() {
        cy.contains('Test blog 2 Test author 2').contains('view').click()
        cy.contains('Test blog 2 Test author 2').contains('remove').click()

        cy.contains(`blog 'Test blog 2' by 'Test author 2' removed`)
        cy.contains('Test blog 2 Test author 2').should('not.exist')
      })

      it('blogs are ordered by likes', function() {
        cy.get('.blog').then(blogs => {
          cy.wrap(blogs[0]).contains('Test blog 3 Test author 3')
          cy.wrap(blogs[1]).contains('Test blog 2 Test author 2')
          cy.wrap(blogs[2]).contains('Test blog 1 Test author 1')
        })
      })

      describe('and the user has logged out', () => {
        beforeEach(function() {
          cy.contains('logout').click()
        })
        
        it('no blogs are shown', function () {
          cy.contains('Test blog 2 Test author 2').should('not.exist')
        })

        it('a blog cannot be deleted by another user', function() {
          cy.login({username: 'testuser2', password: 'testpassword2'})

          cy.contains('Test blog 2 Test author 2').contains('view').click()
          cy.contains('Test blog 2 Test author 2').contains('remove').should('not.exist')
        })
      }) 
    })
  })
})