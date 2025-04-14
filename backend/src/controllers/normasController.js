const e = require("cors");
const normas = require("../models/normasModel.js");

//aqui teria que fazer um crud com o banco de dados(?)'

exports.listarNormas = (req, res) => {
    try {
        res.json(normas);
    } catch (error) {
        console.error("Erro ao listar normas:", error);
        res.status(500).json({ message: "Erro ao listar normas." });
    }
};


exports.adicionarNorma = (req, res) => {
    try{
        const { orgao, tipo, numero, data, ementa, status } = req.body;
        const novaNorma = {
            orgao,
            tipo,
            numero, //verificar se o número é passado na hora do cadastro ou deve ser gerado automaticamente.
            data: new Date(data),
            ementa,
            status,
            acoes: ["verPDF", "modificarNorma", "---", "excluirNorma"]
        };
        if (!orgao || !numero || !ementa) {
            return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
        }
        normas.push(novaNorma);
        res.status(201).json(novaNorma);
    } catch (error) {
        console.error("Erro ao adicionar norma:", error);
        res.status(500).json({ message: "Erro ao adicionar norma." });
    }
};

exports.buscarNormaPorNumero = (req, res) => {
    const numero = String(req.params.numero);
    const normaEncontrada = normas.find((norma) => String(norma.numero) === numero);
    if (normaEncontrada) {
        res.json(normaEncontrada);
    } else {
        res.status(404).json({ message: "Norma não encontrada." });
    }
}; //faço por ID, por nome ou por todos os campos?

exports.modificarNorma = (req, res) => {
    const numero = String(req.params.numero);
    const normaEncontrada = normas.find((norma) => String(norma.numero) === numero);
    if (normaEncontrada) {
        const { orgao, tipo, ementa, status } = req.body;
        normaEncontrada.orgao = orgao || normaEncontrada.orgao;
        normaEncontrada.tipo = tipo || normaEncontrada.tipo;
        normaEncontrada.ementa = ementa || normaEncontrada.ementa;
        normaEncontrada.status = status || normaEncontrada.status;
        res.json(normaEncontrada);
    } else {
        res.status(404).json({ message: "Norma não encontrada." });
    }
};

exports.excluirNorma = (req, res) => {
    try{
        const numero = String(req.params.numero);
        const normaEncontrada = normas.find((norma) => String(norma.numero) === numero);
        if (normaEncontrada) {
            const indice = normas.indexOf(normaEncontrada);
            normas.splice(indice, 1);
            res.status(204).send();}
        else {
            res.status(404).json({ message: "Norma não encontrada." });
        }    
    } catch (error) {
        res.status(500).json({ message: "Erro ao excluir norma." });
    }
};

//exports.verPDF = (req, res) => {};

