const fastify = require('fastify');

describe('Auction Engine', () => {
  let app;

  beforeAll(async () => {
    app = fastify();
    // Register routes here if needed, but since index.js is the entry, this is basic
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return status online', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/'
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.status).toBe('online');
    expect(body.service).toBe('auction-engine');
  });
});