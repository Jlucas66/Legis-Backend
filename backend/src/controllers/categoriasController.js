const fs = require("fs");
const path = require("path");
const categoriasPath = path.join(__dirname, "../data/categorias.json");


exports.lerCategorias = () => {
    const data = fs.readFileSync(categoriasPath);
    return JSON.parse(data);
};

exports.salvarCategorias = (categorias) => {
    fs.writeFileSync(categoriasPath, JSON.stringify(categorias, null, 2));
};

exports.listarCategorias = (req, res) => {
    try {
        const rawData = fs.readFileSync(categoriasPath);
        const categorias = JSON.parse(rawData);

        const categoriasFiltradas = categorias.map(categoria => ({
            id: categoria.id,
            nome: categoria.nome,
            ativo: categoria.ativo ? "Ativo" : "Inativo",
        }));

        res.json(categoriasFiltradas);
    } catch (error) {
        console.error("Erro ao listar categorias:", error);
        res.status(500).json({ message: "Erro ao listar categorias." });
    }
}

exports.adicionarCategoria = (req, res) => {
    try {
        const { nome, ativo } = req.body;
        const categorias = exports.lerCategorias();
        const salvarCategorias = exports.salvarCategorias;

        const novaCategoria = {
            id: categorias.length > 0 ? Math.max(...categorias.map(t => t.id)) + 1 : 1,
            nome,
            ativo
        };

        categorias.push(novaCategoria);
        salvarCategorias(categorias);
        res.status(201).json(novaCategoria);
    } catch (error) {
        console.error("Erro ao adicionar categoria:", error);
        res.status(500).json({ message: "Erro ao adicionar categoria." });
    }
}

exports.buscarCategoriaPorId = (req, res) => {
    try {
        const rawData = fs.readFileSync(categoriasPath);
        const categorias = JSON.parse(rawData);
        const id = parseInt(req.params.id);

        const categoria = categorias.find(categoria => categoria.id === id);
        if (!categoria) {
            return res.status(404).json({ message: "Categoria não encontrada." });
        }
        const categoriaFiltradaPorID = {
            id: categoria.id,
            nome: categoria.nome,
            ativo: categoria.ativo ? "Ativo" : "Inativo",
            tipo: categoria.tipo
        };
        res.json(categoriaFiltradaPorID);
    } catch (error) {
        console.error("Erro ao buscar categoria por ID:", error);
        res.status(500).json({ message: "Erro ao buscar categoria por ID." });
    }
    
}




exports.atualizarCategoria = (req, res) => {
    try {
        const { id } = req.params;
        const categorias = exports.lerCategorias();
        const salvarCategorias = exports.salvarCategorias;

        const categoriaIndex = categorias.findIndex(categoria => categoria.id === parseInt(id));

        if (categoriaIndex === -1) {
            return res.status(404).json({ message: "Categoria não encontrada." });
        }

        const { nome, ativo, tipo } = req.body;
        categorias[categoriaIndex] = { nome, ativo, tipo, id: parseInt(id) };

        salvarCategorias(categorias);
        res.json(categorias[categoriaIndex]);
    } catch (error) {
        console.error("Erro ao atualizar categoria:", error);
        res.status(500).json({ message: "Erro ao atualizar categoria." });
    }
}

exports.excluirCategoria = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const categorias = exports.lerCategorias();
        const categoriaIndex = categorias.findIndex(categoria => categoria.id === id);
        
        
        if (categoriaIndex === -1) {
            return res.status(404).json({ message: "Categoria não encontrada." });
        }
        categorias[categoriaIndex].ativo = !categorias[categoriaIndex].ativo;
        exports.salvarCategorias(categorias);
        res.status(200).json({ message: "Categoria excluída com sucesso." });
    } catch (error) {
        console.error("Erro ao excluir categoria:", error);
        res.status(500).json({ message: "Erro ao excluir categoria." });
    }
}