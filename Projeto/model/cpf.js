function validarCPF(cpfValidate) {

    cpf = cpf.replace(/[^\d]/g, ''); 
    if (cpf.length !== 11 || !/^\d{11}$/.test(cpf)) return false; 

    if (/^(\d)\1+$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    let digit = (remainder >= 10) ? 0 : remainder;

    if (parseInt(cpf.charAt(9)) !== digit) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    digit = (remainder >= 10) ? 0 : remainder;

    return parseInt(cpf.charAt(10)) === digit;
    
}