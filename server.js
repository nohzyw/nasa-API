const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(express.json());
// Esta linha diz ao Express para servir automaticamente arquivos da pasta "public" (como index.html)
app.use(express.static('public'));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/api/buscar', async (req, res) => {
    const { astro } = req.query;
    if (!astro) return res.status(400).json({ erro: 'Faltou o termo.' });

    const apiKey = process.env.NASA_API_KEY || 'PcK8PGWMHMhPdtcGQnF7KnNbNqHdh9HnmjwrmGQq';
    const astroAlvo = astro.trim().toLowerCase();

    try {
        const url = `https://science.nasa.gov/wp-json/wp/v2/apod-basic/?api_key=${apiKey}&start_date=2026-08-01&end_date=2026-10-27`;
        const response = await axios.get(url);
        const data = Array.isArray(response.data) ? response.data : [response.data];

        const imagensFiltradas = data.filter(item => {
            const ehImagem = item.media_type === 'image';
            const copyrightLower = item.copyright ? item.copyright.toLowerCase() : '';
            const semCopyright = !item.copyright || copyrightLower.includes('nasa') || copyrightLower.includes('public domain') || copyrightLower.includes('domínio público');
            const contemAstro = (item.title && item.title.toLowerCase().includes(astroAlvo)) || (item.explanation && item.explanation.toLowerCase().includes(astroAlvo));
            return ehImagem && semCopyright && contemAstro;
        });

        const resultado = imagensFiltradas.map(item => ({
            titulo: item.title,
            url: item.hdurl || item.url,
            data: item.date,
            alt: item.alt || item.title
        }));

        return res.json(resultado);
    } catch (error) {
        console.error('Erro no servidor ao buscar APOD:', error.message);
        return res.status(500).json({ erro: 'Erro ao processar dados da NASA.' });
    }
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
