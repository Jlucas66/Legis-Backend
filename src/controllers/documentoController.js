const fs = require("fs");
const path = require("path");
const documentosPath = path.join(__dirname, "../data/tipos-categorias.json");

exports.lerDocumentos = () => {
    const data = fs.readFileSync(documentosPath);
    return JSON.parse(data);
}

exports.salvarDocumentos = (documentos) => {
    fs.writeFileSync(documentosPath, JSON.stringify(documentos, null, 2));
};

exports.listarDocumentos = (req, res) => {
    try {
        const rawData = fs.readFileSync(documentosPath);
        const documentos = JSON.parse(rawData);

        const documentosFiltrados = documentos.map(documento => ({
            id: documento.id,
            nome: documento.nome,
            ativo: documento.ativo ? "Ativo" : "Inativo",
            categoria: documento.categoria?.nome || "N/A",
        }));

        res.json(documentosFiltrados);
    } catch (error) {
        console.error("Erro ao listar documentos:", error);
        res.status(500).json({ message: "Erro ao listar documentos." });
    }
}

exports.adicionarDocumento = (req, res) => {
    try {
        const { nome, ativo, categoria } = req.body;
        const documentos = exports.lerDocumentos();
        const salvarDocumentos = exports.salvarDocumentos;

        const novaDocumento = {
            id: documentos.length > 0 ? Math.max(...documentos.map(d => d.id)) + 1 : 1,
            nome,
            categoria
        };

        documentos.push(novaDocumento);
        salvarDocumentos(documentos);
        res.status(201).json(novaDocumento);
    } catch (error) {
        console.error("Erro ao adicionar documento:", error);
        res.status(500).json({ message: "Erro ao adicionar documento." });
    }
}

exports.buscarDocumentoPorId = (req, res) => {
    try {
        const rawData = fs.readFileSync(documentosPath);
        const documentos = JSON.parse(rawData);
        const id = parseInt(req.params.id);

        const documento = documentos.find(documento => documento.id === id);
        if (!documento) {
            return res.status(404).json({ message: "Documento não encontrado." });
        }

        const documentoFiltradoPorID = {
            id: documento.id,
            nome: documento.nome,
            ativo: documento.ativo ? "Ativo" : "Inativo",
            categoria: documento.categoria?.nome || "N/A",
        };

        res.json(documentoFiltradoPorID);
    } catch (error) {
        console.error("Erro ao buscar documento por ID:", error);
        res.status(500).json({ message: "Erro ao buscar documento por ID." });
    }
}

exports.atualizarDocumento = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const documentos = exports.lerDocumentos();
        const salvarDocumentos = exports.salvarDocumentos;

        const documentoIndex = documentos.findIndex(documentos => documentos.id === id);
        if (documentoIndex === -1) {
            return res.status(404).json({ message: "Documento não encontrado." });
        }

        const { nome, categoria } = req.body;
        documentos[documentoIndex] = { nome, categoria, id:parseInt(id) };

        salvarDocumentos(documentos);
        res.json(documentos[documentoIndex]);
    } catch (error) {
        console.error("Erro ao atualizar documento:", error);
        res.status(500).json({ message: "Erro ao atualizar documento." });
    }
}

exports.deletarDocumento = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const documentos = exports.lerDocumentos();
        const documentosIndex = documentos.findIndex(documento => documento.id === id);

        if (documentosIndex === -1) {
            return res.status(404).json({ message: "Documento não encontrado." });
        }

        documentos[documentosIndex].ativo = !documentos[documentosIndex].ativo;
        exports.salvarDocumentos(documentos);
        res.status(200).send({ message: "Documento deletado com sucesso." });
    } catch (error) {
        console.error("Erro ao deletar documento:", error);
        res.status(500).json({ message: "Erro ao deletar documento." });
    }
}