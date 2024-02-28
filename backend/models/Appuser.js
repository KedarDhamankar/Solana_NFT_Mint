const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AppuserSchema = new Schema({
    wallet_address: {
        type: String,
        required: [true, 'Please enter an Username'],
        unique: true,
        lowercase: true,
    },
    nft_id: {
        type: [String],
    }
});

const Appuser = mongoose.model('Appuser', AppuserSchema);
module.exports = Appuser;