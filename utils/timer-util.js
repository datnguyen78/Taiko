const timer = (ms) => new Promise((res) => setTimeout(res, ms));

// Random number between min (inclusive) and max (inclusive)
const randomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Random wait time between 1 and 2 minutes (60,000 to 120,000 milliseconds)
const waitRandom = async (min, max) =>
  await timer(randomNumber(min, max));

module.exports = { waitRandom, timer };
