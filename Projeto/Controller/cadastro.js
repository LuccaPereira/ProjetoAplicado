function validarCPF(cpf) {
    var cpf = document.getElementById('inputCpf').value

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
}

function submitForm() {
        var nome = document.getElementById('nome').value
        var cpf = document.getElementById('inputCpf').value; 
        var OAB = document.getElementById('OAB').value 
        var email =  document.getElementById('email').value 
        var senha = document.getElementById('senha').value 

    if (!isValidEmail(email)) {
        alert('Por favor, insira um email válido.');
        return; 
    }

    if (senha.length >= 6) {
        alert('A senha deve ter no mínimo 6 caracteres.');
        return; 
    }
    
    if (!validarCPF(cpf)) {
        alert('favor inserir um CPF valido.');
        return; 
    } else {
        validarCPF(cpf);
    }
   
    if (OAB.length !== 8){
        alert('O número da OAB deve conter 8 digitos');
        return; 
    }
}