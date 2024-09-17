// __tests__/servidor.test.js
const request = require('supertest');
const app = require('../index'); // Corrigido o caminho

describe('GET /', () => {
    it('should return the login.html file', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('Login'); // Ajuste conforme o conteúdo da sua página
    });
});
