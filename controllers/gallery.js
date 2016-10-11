exports.handleFileUpload = function(req, res, next) {
    console.log('File uploaded');
    console.log(req.file);
    next(req, res);
}
