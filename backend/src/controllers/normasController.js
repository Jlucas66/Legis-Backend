const e = require("cors");
const fs = require("fs");
const path = require("path");
const normas = path.join(__dirname, "../data/norma.json");

//aqui teria que fazer um crud com o banco de dados(?)'


exports.lerNormas = () => {
    const data = fs.readFileSync(normas, "utf8");
  return JSON.parse(data);
}
exports.salvarNormas = (normas) => {
    fs.writeFileSync(filePath, JSON.stringify(normas, null, 2));
};

exports.listarNormas = (req, res) => {
    try {
        const normas = lerNormas();
        res.json(normas);
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

        const normas = lerNormas();
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
    const normas = lerNormas();

    const resultado = normas.filter(norma => {
        return (!orgao || norma.orgao.toLowerCase().includes(orgao.toLowerCase())) &&
               (!tipo || norma.tipo.toLowerCase().includes(tipo.toLowerCase())) &&
               (!numero || norma.numero.toString() === numero.toString());
  });

  res.json(resultado);
}; //faço por ID, por nome ou por todos os campos?

exports.modificarNorma = (req, res) => {
    const id = parseInt(req.params.id);
    const normas = lerNormas();
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
        const normas = lerNormas();
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

cexports.gerarRelatorioPDF = (req, res) => {
    const normas = lerNormas();
    const doc = new PDFDocument();
  
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="relatorio_normas.pdf"');
  
    doc.pipe(res);
  
    doc.fontSize(18).text('Relatório de Normas', { align: 'center' });
    doc.moveDown();
  
    normas.forEach((norma, i) => {
      doc.fontSize(12)
        .text(`Órgão: ${norma.orgao}`)
        .text(`Tipo: ${norma.tipo}`)
        .text(`Número: ${norma.numero}`)
        .text(`Data: ${norma.data}`)
        .text(`Ementa: ${norma.ementa}`)
        .moveDown();
      if (i < normas.length - 1) doc.moveDown();
    });
  
    doc.end();
  };


