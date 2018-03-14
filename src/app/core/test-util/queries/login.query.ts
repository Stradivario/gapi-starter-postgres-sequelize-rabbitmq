export const LOGIN_QUERY_TEST = `
query login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    email
    token
    user {
      id
      type
      name
      credential {
        id
        email
        password
      }
    }
  }
}
`;
