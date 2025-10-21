import http from "http";



const server = http.createServer((req, res) => {
  console.log(req.url);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify({ text: "Hello World!" }));
  res.end();

});

server.listen(3000, () => { console.log(`listening to port 3000`) });
