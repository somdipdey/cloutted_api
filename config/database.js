const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  poolSize: parseInt(process.env.POOL_SIZE) || 40,
  // dbName: "cloutted_dev",
};

module.exports = {
  dbURI: `mongodb+srv://cloutteddev:${process.env.DB_PASS}@cluster0.skx2j.mongodb.net/cloutted?retryWrites=true&w=majority`,
  options,
};
