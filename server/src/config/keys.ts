require('dotenv').config();

const pawEnvKeys = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'MONGO_URI', 'COOKIE_KEY'] as const;
type PAWEnvKey = typeof pawEnvKeys[number];

// Defaults for testing
const testKeys: Record<PAWEnvKey, string> = {
  GOOGLE_CLIENT_ID: 'testGoogleId',
  GOOGLE_CLIENT_SECRET: 'testGoogleSecret',
  MONGO_URI: 'testURI',
  COOKIE_KEY: 'testCookieKey',
};

export const getEnvironmentVariable = (key: PAWEnvKey): string => {
  if (process.env.NODE_ENV === 'test') return testKeys[key];

  const environmentValue = process.env[key];
  if (!environmentValue) {
    throw Error(`You must provide ${key} in the environment.`);
  }

  return environmentValue;
};
