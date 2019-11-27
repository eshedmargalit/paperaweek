export function getAuthData() {
  var authData = {
    ClientId: '2vpouevkvestdot5o94m8tbnf4',
    AppWebDomain: 'paperaweek.auth.us-west-2.amazoncognito.com',
    TokenScopesArray: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
    RedirectUriSignIn: 'http://localhost:3000/dashboard',
    RedirectUriSignOut: 'http://localhost:3000/signout',
    IdentityProvider: 'Google',
    UserPoolId: 'us-west-2_qQAUz1CtO',
    AdvancedSecurityDataCollectionFlag: true,
  };

  return authData;
}
