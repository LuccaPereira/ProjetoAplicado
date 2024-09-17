import express from "express";

const app = express();
app.use(express.json());

app.use(express.static("public"));
app.use("/images", express.static("public"));

app.listen(3030, () => {
    console.log("Servidor online na porta 3030");
})