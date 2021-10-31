/*
This code handles the way in which user profiles are generated and retrieved.
*/

// Constants.
const records = [{ id: 1, username: "admin", hashedPassword: "84983c60f7daadc1cb8698621f802c0d9f9a3c3c295c810748fb048115c186ec" }];

exports.findById = function (id, cb) {
    process.nextTick(function () {
        let idx = id - 1;

        if (records[idx]) {
            cb(null, records[idx]);
        } else {
            cb(new Error("User " + id + " does not exist."));
        }
    });
};

exports.findByUsername = function (username, cb) {
    process.nextTick(function () {
        let record;

        for (let i = 0; i < records.length; i++) {
            record = records[i];
            if (record.username === username) {
                return cb(null, record);
            }
        }

        return cb(null, null);
    });
};
