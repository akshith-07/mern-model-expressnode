const http = require("http");
const url = require("url");
const querystring = require("querystring");

let dataStore = {};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;
  const method = req.method.toLowerCase();

  if (method === "get") {
    if (pathname === "/") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(dataStore));
    } else {
      const key = pathname.slice(1);
      if (dataStore.hasOwnProperty(key)) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(dataStore[key]));
      } else {
        res.writeHead(404);
        res.end("Key not found");
      }
    }
  } else if (method === "post") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const parsedBody = querystring.parse(body);
      const key = parsedBody.key;
      const value = parsedBody.value;
      dataStore[key] = value;
      res.writeHead(201);
      res.end("Key-value pair stored");
    });
  } else if (method === "put") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const parsedBody = querystring.parse(body);
      const key = parsedBody.key;
      const value = parsedBody.value;
      if (dataStore.hasOwnProperty(key)) {
        dataStore[key] = value;
        res.writeHead(200);
        res.end("Value updated");
      } else {
        res.writeHead(404);
        res.end("Key not found");
      }
    });
  } else if (method === "delete") {
    if (pathname === "/") {
      dataStore = {};
      res.writeHead(200);
      res.end("Data store cleared");
    } else {
      const key = pathname.slice(1);
      if (dataStore.hasOwnProperty(key)) {
        delete dataStore[key];
        res.writeHead(200);
        res.end("Key deleted");
      } else {
        res.writeHead(404);
        res.end("Key not found");
      }
    }
  } else {
    res.writeHead(405);
    res.end("Method not supported");
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
