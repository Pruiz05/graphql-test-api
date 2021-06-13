const login = `mutation userAuthentication($input: AuthenticationInput) {
  userAuthentication(input: $input) {
    token
  }
}
`;

const query_variables = `{
  "input": {
    "email": "janedoe@correo.com",
    "password": "1234"
  }
}`;
