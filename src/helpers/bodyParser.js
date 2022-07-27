function bodyParser(request, callback) {
  let body = "";
  //! Informações do body vem através de streams, ou seja, vem aos poucos.

  //! Evento para ouvir os dados chegando.
  request.on("data", (chunk) => {
    body += chunk;
  });
  //! Quando receber o ultimo pedaço da mensagem
  request.on("end", () => {
    request.body = JSON.parse(body);
    callback();
  });
}

module.exports = bodyParser;
