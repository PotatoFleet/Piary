const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
  date: Date, // new Entry({ date: '2022-9-30' })
  pages: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("Entry", entrySchema);
