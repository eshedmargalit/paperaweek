import request from 'supertest';
import createApp from '../../utils';

describe('healthRoutes', () => {
  const app = createApp();

  describe('/health', () => {
    it('responds with status code 200', async () => {
      const res = await request(app).get('/health');
      expect(res.body.uptime).toBeTruthy();
    });
  });
});
