import request from 'supertest';
import app from '../src/app';

describe('Routes', () => {
  it('should have roles route', async () => {
    const response = await request(app).get('/api/roles');
    expect(response.statusCode).toBe(200);
  });

  it('should render Hello World', async () => {
    const response = await request(app).get('/api/roles');
    expect(response.body).toEqual({ tags: 'Hello world 111' });
  });

  it('should return OK for cards', async () => {
    const response = await request(app).get('/api/cards');
    expect(response.statusCode).toBe(200);
  });

  it('should return all 25 cards', async () => {
    const response = await request(app).get('/api/cards');
    expect(response.body.length).toBe(25);
  });

  it('should return all cards with data', async () => {
    const response = await request(app).get('/api/cards');
    expect(response.body[0]).toEqual({
      name: 'Director',
      action:
        'Active player takes 2 random cards from the deck. They may secretly change any cards with their own, and then return 2 cards to the deck.',
      simpleAction: 'Exchange 2 cards.',
      counteraction: null,
      category: 'communications',
      id: 0
    });

    expect(response.body[10]).toEqual({
      name: 'Banker',
      action: 'Active player takes ⓷  from the Treasury.',
      simpleAction: 'Take ⓷ .',
      counteraction: null,
      category: 'finance',
      id: 10
    });

    expect(response.body[24]).toEqual({
      name: 'Protestor',
      action:
        'Active player pays ⓶  to the Treasury and declares Target. Any player may challenge, if not successfully challenged then any other player can pay ⓷  to the Treasury to join the riot and the Target loses a life. The player joining the Riot does not have to claim Protestor, if no other player joins the Riot, the action fails without coins being returned.',
      simpleAction:
        'Pay ⓶ , pick target. Another player can pay ⓷  to kill target.',
      counteraction:
        'After both players have joined the Riot, the Target may claim Protestor to avoid losing a life.',
      category: 'specialInterest',
      id: 24
    });
  });
});
