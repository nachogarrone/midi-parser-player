'use strict';

import mongoose from 'mongoose';

var ParserSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Parser', ParserSchema);
