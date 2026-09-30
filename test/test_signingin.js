const expect = require("expect");

const signingin = require("../lib/signingin");

describe("Sign-in helpers", function () {
    it("produces a stable SHA-256 hash", function () {
        expect(signingin.getHash("parishioner")).toBe(
            "d72b305be8422550aadd12baaa92a6222e81ca8bb0f0f786f648a2f12af881ec"
        );
    });

    it("serializes the user id", function (done) {
        signingin.serializer({ id: 42 }, (error, id) => {
            expect(error).toBe(null);
            expect(id).toBe(42);
            done();
        });
    });

    it("accepts a matching password", function (done) {
        const originalFind = signingin.users.findByUsername;
        signingin.users.findByUsername = (username, callback) => {
            callback(null, {
                id: 1,
                username,
                hashedPassword: signingin.getHash("correct horse")
            });
        };

        signingin.strategyFunc("admin", "correct horse", (error, user) => {
            signingin.users.findByUsername = originalFind;
            expect(error).toBe(null);
            expect(user.username).toBe("admin");
            done();
        });
    });

    it("rejects an incorrect password", function (done) {
        const originalFind = signingin.users.findByUsername;
        signingin.users.findByUsername = (username, callback) => {
            callback(null, {
                id: 1,
                username,
                hashedPassword: signingin.getHash("correct horse")
            });
        };

        signingin.strategyFunc("admin", "wrong", (error, user) => {
            signingin.users.findByUsername = originalFind;
            expect(error).toBe(null);
            expect(user).toBe(false);
            done();
        });
    });
});
