// test.js
const { spec } = require('pactum');
const { eachLike, like, custom } = require('pactum-matchers');

//let token;
beforeEach(async () => {
    await spec()
        .post('http://lojaebac.ebaconline.art.br/graphql')
        .withGraphQLQuery(`
        mutation AuthUser($email: String, $password: String) {
            authUser(email: $email, password: $password) {
              success
              token
            }
          }
    `)
        .withGraphQLVariables({
            "email": "admin@admin.com",
            "password": "admin123"
        })
        .stores('token', 'data.authUser.token')

})

it('listagem de usuarios', async () => {
    await spec()
        .post('http://lojaebac.ebaconline.art.br/graphql')
        .withHeaders("Authorization", `#token`)
        .withGraphQLQuery(`
        query {
            Users {
              id
              email
              profile {
                firstName
              }
            }
          }
    `)
        .expectStatus(200)
        .inspect()
        .expectJsonMatch({
            data: {
                Users: eachLike({
                    id: like("657b05fe31b986f1c0a7a053"),
                    email: like("cliente@ebac.art.br"),
                    profile: {
                        firstName: like(null)
                    }
                })
            }
        })
});