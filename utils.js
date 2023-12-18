//logger
async function logger(message) {
  if (!process.env.LOG_URL) return;
  try {
    await fetch(process.env.LOG_URL, {
      method: 'POST',
      body: JSON.stringify({
        time: new Date(),
        message,
      }),
    });
  } catch (e) {
    console.log('Not able to log');
  }
}

module.exports.logger = logger;
