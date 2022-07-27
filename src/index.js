const http = require("http");
const { URL } = require("url");
const routes = require("./routes");
const bodyParser = require("./helpers/bodyParser");

//! url.parse -> Depreciada

const server = http.createServer((request, response) => {
  //* const parsedUrl = url.parse(request.url, true); //? O segundo parametro formata os queryParams de string para objeto
  const parsedUrl = new URL(`http://localhost:3000${request.url}`);
  //? 1 parâmetro -> Endereço completo

  let { pathname } = parsedUrl;
  let id = null;

  const splitEndpoint = pathname.split("/").filter(Boolean);

  if (splitEndpoint.length > 1) {
    pathname = `/${splitEndpoint[0]}/:id`;
    id = splitEndpoint[1];
  }

  const route = routes.find((routeObj) => {
    return routeObj.endpoint === pathname && routeObj.method === request.method;
  });

  if (route) {
    request.query = Object.fromEntries(parsedUrl.searchParams);
    request.params = { id };

    response.send = (statusCode, body) => {
      response.writeHead(statusCode, { "Content-Type": "application/json" });

      response.end(JSON.stringify(body));
    };

    if (["POST", "PUT", "PATH"].includes(request.method)) {
      bodyParser(request, () => route.handler(request, response));
    } else {
      route.handler(request, response);
    }
  } else {
    response.writeHead(404, { "Content-Type": "text/html" });
    response.end(`Cannot ${request.method} ${pathname}`);
  }
});

server.listen(3000, () => {
  console.log("Tamo on❤️");
});
