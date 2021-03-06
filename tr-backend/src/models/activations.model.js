const mongoose = require('mongoose');

let activationsSchema = new mongoose.Schema({
    aid: {
        type: Number,
        required: 'This field is required',
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    rac: {
        type: String,
        required: true
    },
    trauma: {
        type: [String],
        required: true
    },
    notes: {
        type: String
    }
}, autoIncrement = require('mongoose-auto-increment'));

activationsSchema.plugin(autoIncrement.plugin, {model:'Activations', field: 'aid'});


mongoose.model('Activations', activationsSchema);
