const express = require('express');
const app = express();
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
  origin: '*' 
}));

const PORT = process.env.PORT || 5000;
const httpServer = app.listen(PORT, () => {
  console.log('Servidor HTTP iniciado na porta'+ PORT);
});

const server = new WebSocket.Server({ server: httpServer });

server.on('connection', (socket) => {
  console.log('Cliente conectado');

  socket.on('message', (message) => {
    console.log('Mensagem recebida:', message);

    socket.send('Mensagem recebida com sucesso!');
  });

  socket.on('close', () => {
    console.log('Cliente desconectado');
  });
});

app.post('/send-call', (req, res) => {
  const { ramalFisico, phone, document, uraId } = req.body;

  try {
    const obj = { ramalFisico, phone, document, uraId };
    server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(obj));
      }
    });

    console.log("Call sending")
    res.json({ error: false, message: "chamando..." });
  } catch (error) {
    res.json({ error: true, message: "Internal Server error" });
  }
});

console.log('Servidor HTTP e WebSocket iniciados na porta ' + PORT);