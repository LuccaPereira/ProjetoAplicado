export const cpfModel = {
    validarCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');

        if (cpf.length !== 11) {
            return false;
        }

        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let digitoVerif1 = soma % 11 < 2 ? 0 : 11 - (soma % 11);

        if (parseInt(cpf.charAt(9)) !== digitoVerif1) {
            return false;
        }

        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        let digitoVerif2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);

        if (parseInt(cpf.charAt(10)) !== digitoVerif2) {
            return false;
        }

        return true;
    },

    getClientes(url) {
        return axios.get(url);
    },

    updateCliente(url, data) {
        return axios.patch(url, data);
    },

    addCliente(url, data) {
        return axios.post(url, data);
    }
};
