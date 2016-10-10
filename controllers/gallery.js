exports.handleFileUpload = function(req, res, next) {
    console.log('File uploaded');
    console.log(req);
    res.send( { message: 'Photo uploaded.' });
}
