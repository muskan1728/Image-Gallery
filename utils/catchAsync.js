//if async gives some error it catches it and send it to next request i.e. error middleware in app.js 
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}