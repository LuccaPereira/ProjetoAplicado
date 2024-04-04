<?php

// URL do banco de dados Firestore
$databaseURL = "";

// Caminho para o documento que você deseja ler
$documentPath = "collection/documentId";

// URL completa para acessar o documento
$url = $databaseURL . $documentPath . ".json";

// Inicializa uma nova solicitação cURL
$ch = curl_init();

// Define as opções da solicitação cURL
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Executa a solicitação cURL e obtém a resposta
$response = curl_exec($ch);

// Verifica se houve algum erro durante a solicitação
if (curl_errno($ch)) {
    echo 'Erro ao fazer a solicitação: ' . curl_error($ch);
} else {
    // Decodifica a resposta JSON em um array associativo
    $data = json_decode($response, true);

    // Exibe os dados do documento
    print_r($data);
}

// Fecha a solicitação cURL
curl_close($ch);

?>
