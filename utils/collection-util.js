function getChunks(array, chunkSize) {
  const chunks = [];

  // Splitted arrays
  do {
    chunks.push(array.splice(0, chunkSize));
  } while (array.length > 0);

  console.log(`Splitted array into ${chunks.length} chunks`);

  return chunks;
}

module.exports = { getChunks };
