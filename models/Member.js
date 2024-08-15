const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    memberName: { type: String, required: true },
    registerNumber: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    memberId: { type: String, required: true }
}); 

// Create a text index on memberName, registerNumber, and memberId
studentSchema.index({ memberName: 'text', registerNumber: 'text', memberId: 'text' });

module.exports = mongoose.model('Member', studentSchema);
