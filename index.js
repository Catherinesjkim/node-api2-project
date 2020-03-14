const server = require('./api/sever.js'); // importing server

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`\n*** Server Running on http://localhost:${PORT} ***\n`);
});


