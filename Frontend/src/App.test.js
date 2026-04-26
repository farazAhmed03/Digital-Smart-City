import API_BASE_URL from './config';

test('uses production API base URL by default', () => {
  expect(API_BASE_URL).toBe('https://api.kohat.online');
});
