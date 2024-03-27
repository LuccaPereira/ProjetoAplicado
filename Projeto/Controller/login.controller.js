import { validarCPF } from '../model/cpf';

function submitForm() {
    var cpfValidate = document.getElementById('inputCpf');
    var oabValidate = document.getElementById('OAB').value;
   

    if (!cpfValidate.value.trim() || !oabValidate.trim() || !validarCPF(cpfValidate)) {
        alert("Os campos estão vazios ou esse cpf é invalido" + cpfValidate);
        return false;
    } else {
        setTimeout(function() {
            window.location.href = 'C:/Users/LuccaBattaglin/OneDrive - Syniti/Desktop/Projeto/ProjetoAplicado/View/menu.view.html';
        }, 1000); 
    }
}