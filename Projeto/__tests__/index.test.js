import request from 'supertest';
import app from '../src/index'; // Certifique-se de que o caminho está correto

describe('GET /', () => {
    it('should return the login.html file', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('Login'); // Ajuste conforme o conteúdo da sua página
    });
});
