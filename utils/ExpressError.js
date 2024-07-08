class ExpressError extends Error {
    constructor(message, statusCode) {
        // Super calls the constructor of parent class
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;