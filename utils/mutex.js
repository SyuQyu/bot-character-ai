// mutex.js
const { Mutex } = require("async-mutex");

const mutex = new Mutex();

async function withMutex(func) {
  return await mutex.runExclusive(func);
}

module.exports = { withMutex };
