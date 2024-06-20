const MB = 5; // 5mb
const FILE_SIZE_LIMIT = MB * 1024 * 1024; // limita grandezza per i file caricati

const fileSizeLimiter = (req, res, next) => {
    const file = req.files;

    // array che conterrà tutte le immagini che superano i limiti di 5 mb
    const filesOverLImit = [];

    // controllare se file ha dimensione superiore a 5MB

    Object.keys(file).forEach((key) => {
        if (file[key].size > FILE_SIZE_LIMIT) {
            filesOverLImit.push(file[key].name);
        }
    });

    if (filesOverLImit.length > 0) {
        const formattedNames = filesOverLImit.join(" , ");

        return res.status(413).json({ message: `some file are more than 5mb size : ${formattedNames}` });
    }

    next();
};

module.exports = fileSizeLimiter;
