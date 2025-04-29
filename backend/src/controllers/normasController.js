const e = require("cors");
const fs = require("fs");
const path = require("path");
const normasPath = path.join(__dirname, "../data/normas.json");
const categoriasPath = path.join(__dirname, "../data/categorias.json");
const tiposCategoriasPath = path.join(__dirname, "../data/tipos-categorias.json");



exports.lerNormas = () => {
    console.log('Chamou...')
    const data = fs.readFileSync(normasPath, 'utf8');
    console.log(data);
    return JSON.parse(data, 'utf8');
}
exports.salvarNormas = (normas) => {
    fs.writeFileSync(normasPath, JSON.stringify(normas, null, 2), 'utf8');
};

exports.listarNormas = (req, res) => {
    try {
        const rawData = fs.readFileSync(normasPath, 'utf8');
        const normas = JSON.parse(rawData);
    
        const normasFiltradas = normas.map( normas => ({
            id: normas.id,
            data: normas.data,
            ementa: normas.ementa,
            numero: normas.numero,
            tipo: normas.tipoCategoria?.nome || "N/A",
            statusDisponivel: normas.statusDisponivel,
            orgao: normas.tipoCategoria?.categoria?.nome|| "N/A",
            link: normas.link
        }));
        res.json(normasFiltradas.filter(normas => normas.statusDisponivel === true), 'utf8');
    } catch (error) {
        console.error("Erro ao listar normas:", error);
        res.status(500).json({ message: "Erro ao listar normas." });
    }
};

exports.listarNormasAdmin = (req, res) => {
    try {
        const rawData = fs.readFileSync(normasPath, 'utf8');
        const normas = JSON.parse(rawData);
    
        const normasFiltradasAdmin = normas.map( normas => ({
            id: normas.id,
            data: normas.data,
            ementa: normas.ementa,
            numero: normas.numero,
            tipo: normas.tipoCategoria?.nome || "N/A",
            orgao: normas.tipoCategoria?.categoria?.nome|| "N/A",
            ativo: normas.ativo,
            statusDisponivel: normas.statusDisponivel ? "Ativo" : "Inativo",
            link: normas.link,
        }));
        res.json(normasFiltradasAdmin.filter(normas => normas.ativo === true ), 'utf8');
    } catch (error) {
        console.error("Erro ao listar normas:", error);
        res.status(500).json({ message: "Erro ao listar normas." });
    }
};


exports.adicionarNorma = (req, res) => {
    try{
        const { orgao, tipo, numero, ementa, status } = req.body;
        if (!orgao || !numero || !ementa || !tipo || !data) {
            return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
        }

        const normas = exports.lerNormas();
        const novaNorma = {
            id: normas.length > 0 ? normas[normas.length - 1].id + 1 : 1,
            orgao,
            tipo,
            numero,
            data,
            ementa
        };
        normas.push(novaNorma);
        res.status(201).json(novaNorma);
    } catch (error) {
        console.error("Erro ao adicionar norma:", error);
        res.status(500).json({ message: "Erro ao adicionar norma." });
    }
};

exports.buscarNormaPorNumero = (req, res) => {
    const { orgao, tipo, numero } = req.query;
    const normas = exports.lerNormas();

    const resultado = normas.filter(normas => {
        return (!orgao || normas.orgao.toLowerCase().includes(orgao.toLowerCase())) &&
               (!tipo || normas.tipo.toLowerCase().includes(tipo.toLowerCase())) &&
               (!numero || normas.numero.toString() === numero.toString());
  });

  res.json(resultado);
}; //faço por ID, por nome ou por todos os campos?

exports.modificarNorma = (req, res) => {
    const id = parseInt(req.params.id);
    const normas = exports.lerNormas();
    const index = normas.findIndex(n => n.id === id);
  
    if (index === -1) {
      return res.status(404).json({ erro: 'Norma não encontrada.' });
    }
  
    const { orgao, tipo, numero, data, ementa, ativo, statusDisponivel } = req.body;
  
    normas[index] = { id, orgao, tipo, numero, data, ementa, ativo, statusDisponivel };
    salvarNormas(normas);
  
    res.json(normas[index]);
  
};

exports.excluirNorma = (req, res) => {
    try{
        const id = parseInt(req.params.id);
        const normas = exports.lerNormas();
        const novaIndex = normas.findIndex(n =>n.id === id);

      
        if (novaIndex === -1) {
            return res.status(404).json({ erro: 'Norma não encontrada.'})
        }

        normas[novaIndex].ativo = false;

        exports.salvarNormas(normas);
        res.status(200).send(normas)
    } catch (error) {
        res.status(500).json({ message: "Erro ao excluir norma." });
    }
};

exports.modificarStatusNorma = (req, res) => {
    try{
        const id = parseInt(req.params.id);
        const normas = exports.lerNormas();
        const novaIndex = normas.findIndex(n =>n.id === id)

        if (novaIndex === -1) {
            return res.status(404).json({erro: "Norma não encontrada."})
        }
        normas[novaIndex].statusDisponivel = !normas[novaIndex].statusDisponivel;

        // normas[novaIndex].statusDisponivel = false;

        exports.salvarNormas(normas);
        res.status(200).send(normas)
    } catch (error){
        res.status(500).json({message: "Erro ao modificar status da norma."});
    }
}




