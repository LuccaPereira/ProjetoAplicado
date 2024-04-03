function submitForm() {
    var form = document.getElementById('cadAdv');
    
    if (form.checkValidity()) {
        var nome = document.querySelector("#nome").value;
        var OAB = document.querySelector("#OAB").value;
        var cpf = document.querySelector("#inputCpf").value;
        var senha = document.querySelector("#senha").value;
        var email = document.querySelector("#email").value;

        var dados = {
            nome: nome,
            OAB: OAB,
            cpf: inputCpf,
            senha: senha,
            email: email
        };

        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'cadastro.php', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 400) {
                console.log(xhr.responseText);
            } else {
                console.error(xhr.statusText);
            }
        };
        xhr.onerror = function() {
            console.error('Erro de conexão');
        };
        xhr.send(JSON.stringify(dados));
    } else {
        alert('Por favor, preencha todos os campos corretamente.');
    }
}