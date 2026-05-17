import API_BASE_URL from './config';

test('API base URL is configurable for ephemeral ALB deployment', () => {
  expect(API_BASE_URL).toBeDefined();
});
