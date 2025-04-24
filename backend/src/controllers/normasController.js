const e = require("cors");
const fs = require("fs");
const path = require("path");
const normasPath = path.join(__dirname, "../data/normas.json");
const categoriasPath = path.join(__dirname, "../data/categorias.json");
const tiposCategoriasPath = path.join(__dirname, "../data/tipos-categorias.json");



exports.lerNormas = () => {
    const data = fs.readFileSync(normasPath, 'utf8');
  return JSON.parse(data, 'utf8');
}
exports.salvarNormas = (normas) => {
    fs.writeFileSync(normas, JSON.stringify(normas, null, 2));
};

exports.listarNormas = (req, res) => {
    try {
        const rawData = fs.readFileSync(normasPath, 'utf8');
        const normas = JSON.parse(rawData);
    
        const normasFiltradas = normas.map( normas => ({
            data: normas.data,
            ementa: normas.ementa,
            numero: normas.numero,
            tipo: normas.tipoCategoria?.nome || "N/A",
            orgao: normas.tipoCategoria?.categoria?.nome|| "N/A",
            link: normas.link,
        }));
        res.json(normasFiltradas, 'utf8');
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
            data: normas.data,
            ementa: normas.ementa,
            numero: normas.numero,
            tipo: normas.tipoCategoria?.nome || "N/A",
            orgao: normas.tipoCategoria?.categoria?.nome|| "N/A",
            status: normas.ativo ? "Ativo" : "Inativo",
            link: normas.link,
        }));
        res.json(normasFiltradasAdmin, 'utf8');
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
  
    const { orgao, tipo, numero, data, ementa } = req.body;
  
    normas[index] = { id, orgao, tipo, numero, data, ementa };
    salvarNormas(normas);
  
    res.json(normas[index]);
  
};

exports.excluirNorma = (req, res) => {
    try{
        const id = parseInt(req.params.id);
        const normas = exports.lerNormas();
        const novaLista = normas.filter(n => n.id !== id);
      
        if (novaLista.length === normas.length) {
          return res.status(404).json({ erro: 'Norma não encontrada.' });
        }
      
        salvarNormas(novaLista);
        res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: "Erro ao excluir norma." });
    }
};

exports.gerarRelatorioPDF = (req, res) => {
    const normas = exports.lerNormas();
    const doc = new PDFDocument();
  
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="relatorio_normas.pdf"');
  
    doc.pipe(res);
  
    doc.fontSize(18).text('Relatório de Normas', { align: 'center' });
    doc.moveDown();
  
    normas.forEach((norma, i) => {
      doc.fontSize(12)
        .text(`Órgão: ${normas.orgao}`)
        .text(`Tipo: ${normas.tipo}`)
        .text(`Número: ${normas.numero}`)
        .text(`Data: ${normas.data}`)
        .text(`Ementa: ${normas.ementa}`)
        .moveDown();
      if (i < normas.length - 1) doc.moveDown();
    });
  
    doc.end();
  };


