const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// type Student = {
//  student_id: Number;
//  name: String;
// }

const periodSchema = new Schema({
  name: String,
  columns: {
    type: Number,
    required: true
  },
  students:[
    // type: Student,
    // required: true
    {
      student_id: Number,
      name: String
    }
  ]
}, {timestamps: true});

const Period = mongoose.model('Period', periodSchema);
module.exports = Period;
