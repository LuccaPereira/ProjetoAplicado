const request = require('supertest');
const app = require('../src/index').default; // Certifique-se de usar o export default

describe('GET /', () => {
    it('should return the login.html file', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('login'); // Ajuste conforme o conteúdo da sua página
    });
});
