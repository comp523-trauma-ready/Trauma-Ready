const fs = require('fs');
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const path = require('path');

// Connecting to the database
let uri = process.env.MONGODB_URI;
if (uri) {
	mongoose.connect(uri, {useNewUrlParser: true},
        (err) => {
            if (!err) {
                console.log('MongoDB Connection Successful');
            } else {
                console.log(`Error in DB connection : ${err}`);
            }
        }
		);
} else {
    // Read credentials from localfile
    const credsFile = path.resolve(__dirname, 'credentials.txt');
    const contents = fs.readFileSync(credsFile).toString().split(";");

    let sp = contents[0].split(" = ")[1];
    let dp = contents[1].split(" = ")[1];
    let up = contents[2].split(" = ")[1];
    let pp = contents[3].split(" = ")[1];

    let server = sp.substring(1, sp.length-1);
    let database = dp.substring(1, dp.length-1);
    let user = up.substring(1, up.length-1);
    let password = pp.substring(1, pp.length-1);
    mongoose.connect(`mongodb://${user}:${password}@${server}/${database}`, {useNewUrlParser: true},
        (err) => {
            if (!err) {
                console.log('MongoDB Connection Successful');
            } else {
                console.log(`Error in DB connection : ${err}`);
            }
        }
    );
}

autoIncrement.initialize(mongoose.connection);

require('./user.model');
require('./hospital.model');
require('./activations.model');
require('./rac.model');
require('./trauma.model');
