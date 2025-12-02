describe('Formulario de contato', () => {
  it('Deve preencher e enviar o formulario de cadastro e depois se logar com a conta criada', () => {
    cy.visit('http://localhost:3000/register')

    cy.get('input[name="nome"]').type('Vitória Teste')
    cy.get('input[name="cpfcnpj"]').type('05253464069')

    cy.get('input[name="telefone"]').type('54981253802')
    cy.get('input[name="cep"]', { timeout: 10000 }).type('99060210')
    cy.get('input[name="email"]').type('teste@teste.teste')
    cy.get('input[name="password"]').type('201407')
    cy.get('input[name="nroConta"]').type(258456)

    cy.get('button[type="submit"]').click()
    cy.visit('http://localhost:3000/login')

    cy.get('input[name="email"]').type('teste@teste.teste')
    cy.get('input[name="password"]').type('201407')
    cy.get('button[type="submit"]').click()

    cy.contains("Bem Vindo")




  })
})
