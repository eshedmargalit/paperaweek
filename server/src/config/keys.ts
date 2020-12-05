const pawEnvKeys = ['googleClientID', 'googleClientSecret', 'mongoURI', 'cookieKey'] as const;
type PAWEnvKey = typeof pawEnvKeys[number];

// Defaults for testing
const testKeys: Record<PAWEnvKey, string> = {
  googleClientID: 'testGoogleId',
  googleClientSecret: 'testGoogleSecret',
  mongoURI: 'testURI',
  cookieKey: 'testCookieKey',
};

export const getEnvironmentVariable = (key: PAWEnvKey): string => {
  if (process.env.NODE_ENV === 'test') return testKeys[key];

  const environmentValue = process.env[key];
  if (!environmentValue) {
    throw Error(`You must provide ${key} in the environment.`);
  }

  return environmentValue;
};
