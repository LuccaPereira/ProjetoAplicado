function submitForm() {
    var cpfValidate = document.getElementById('inputCpf').value;
    var oabValidate = document.getElementById('OAB').value;

    if (!cpfValidate.trim () || !oabValidate.trim()) {
        alert("Os campos estão vazios");
        
        return false;
    } else {

        setTimeout(function() {
            window.location.href = 'C:/Users/LuccaBattaglin/OneDrive - Syniti/Desktop/Projeto/ProjetoAplicado/View/menu.view.html';
        }, 2000); 
    }
}