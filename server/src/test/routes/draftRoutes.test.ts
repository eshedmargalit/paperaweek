import request from 'supertest';
import createApp from '../../utils';

describe('draftRoutes', () => {
  const app = createApp();

  describe('/api/drafts', () => {
    xit('responds with status code 200', async () => {
      const res = await request(app)
        .get('/api/drafts')
        .set('Cookie', ['myApp-token=12345667', 'myApp-other=blah'])
        .send();
      console.log(res.body);
      expect(res.body.error).toMatch(/You must log in/);
    });
  });
});
