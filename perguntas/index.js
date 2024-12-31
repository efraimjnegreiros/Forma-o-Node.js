const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database.js");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");
const { where } = require("sequelize");

//Database
connection.authenticate().then(()=>{
    console.log("Conexão Feita com o banco de dados")
}).catch((e) => {
    console.log("Erro ao tentar se conexar ao banco!")
})


// Setando a view engine
app.set('view engine', 'ejs');
// A aplicação permite arquivos estáticso
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', (req, res)=>{
    Pergunta.findAll({ raw:true, order: [
        ['id','desc']
    ] }).then(perguntas=>{
        res.render('index', {
            perguntas: perguntas
        });
    });
});

app.get('/pergunta/:id', (req, res)=>{
    const id = req.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta=>{
        if (pergunta != undefined) {
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [['id', 'desc']]
            }).then(respostas => {
                res.render('pergunta', {
                    pergunta: pergunta,
                    respostas: respostas
                })
            })
            
        } else {
            res.redirect('/')
        }
    });
});

app.post('/responder', (req, res)=> {
    const { corpo, pergunta } = req.body;
    Resposta.create({
        corpo: corpo,
        perguntaId: pergunta
    }).then(() => {
        res.redirect('/pergunta/'+pergunta);
    })
});

app.get('/perguntar', (req, res)=> {
    res.render('perguntar');
});

app.post('/salvarpergunta', (req, res)=> {
    const { titulo, descricao } = req.body;
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(()=>{
        res.redirect('/')
    });
});

app.listen(8080, ()=> {
    console.log("Servidor Rodando!")
});