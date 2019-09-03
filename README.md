## Paper-a-Week

### Development
You'll need two API keys:

1) For the MongoDB instance
1) For Microsoft Cognitive Services, which provides the academic search [MS Cog Services](https://azure.microsoft.com/en-us/services/cognitive-services/)

Create `.env.local` in the root directory and add:

```bash
REACT_APP_DB_CONNECTION_STRING=<your connection string goes here>
```

Create `client/.env.local` and add:
```bash
REACT_APP_MSCOG_KEY1=<MSCOG API key goes here>
```
From there just `yarn install` and `yarn run`!
