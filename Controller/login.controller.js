function submitForm() {
    var cpfValidate = document.getElementById('inputCpf').value;
    var oabValidate = document.getElementById('OAB').value;

    if (!cpfValidate || !oabValidate) {
        alert("Os campos estão vazios");
    } else {

        setTimeout(function() {
            window.location.href = 'file:///C:/Users/LuccaBattaglin/OneDrive%20-%20Syniti/Desktop/api-legislacao-master/api-legislacao-master/View/menu.html';
        }, 2000); 
    }
}