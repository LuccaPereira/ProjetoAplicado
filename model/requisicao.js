const https = require('https');
const axios = require('axios');

const url = 'https://api.escavador.com/api/v1/tribunal/TJSP/busca-por-oab/async';

var inputCpf = document.getElementById('inputCpf');
const payload = {
    numeroOab: inputCpf,
    estadoOab: 'SP'
};

const headers = {
    Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNzA1ZTJhMGM1ZTU3YWEwY2Q4NWI3MDFjMWZmODZhMDQ0MGNkNzk4NjMzNjBhMjQ0ODhhOWZjMjVkNmY3MTNiNWFhNzVmM2E3NGRmZmI5MjgiLCJpYXQiOjE3MTAyNTE3MjQuNDg5NDAzLCJuYmYiOjE3MTAyNTE3MjQuNDg5NDA1LCJleHAiOjIwMjU3ODQ1MjQuNDg3MTY0LCJzdWIiOiIxNzE4ODY2Iiwic2NvcGVzIjpbImFjZXNzYXJfYXBpX3BhZ2EiXX0.zRV9I_e0GCZVsE5weSm58tF8vw3_8CA16NQJ3i2M7xOCNcvciGBoWm6ZpEYpJQ8obnTAVO60yKrmlf0GCV1H-xNFV-JF4RNC85CsnBj9pY39gUxdI0xNsEROnYpq1BA2n1a9IJEQ_hA_MPOXEAOAc-FMdZedPx1ZysFflXlGq_97IsRAFsrAunG3KHTay9Pt8INIfqpNUfajO4Xh3yQw4DP-PbYrZ-vFT8RHOQaHx1P81E_nroo_x-2bDZPCaYiXKDqefZcDolYlN9b_vJHBUXAHTgUpCZefXXRcq-OKnWAjk6id9a5rz16a_pMMy8-oZ_b0IqRsZtvCQHDc7M3YA7UyLF5kaNTpEc5gyo4B96QurYX3LXBwoKOCoQoMUUDfpUXWOR277acRvQj7INbKSaKlWcbBZGht0MuMjl7sPPYjVBUkGy1obbskiusbNKmGnJ7h49gPbGCr2_xLh9zFDe31Jc3abETi4iHkWMIx64DW-_Fd68jjJNLrhDeQfKwIWIp84FWcUOjyLjypQnWRLioz_aMLWgvBCcF-fEL-eY1gK68lxI0FnrwtPfqrYiwUEJIS2H_IiOZLXn6YbhmS08LJWyntuiQXhB8FsFcIzcKMTI3ifNOtYfExMoVTMMpCKY5ifweGX2I4y2mIDMahhD0oXDa9AbLnl0VwTbFKKzY',
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json'
};

let oData = {};
axios.post(url, payload, { headers })
    .then(response => {
        const parsed = response.data;
        console.log(JSON.stringify(parsed, null, 4));

        oData = parsed;
        console.log('Dados salvos em oData:', oData);
    })
    .catch(error => {
        console.error('Erro:', error);
    });