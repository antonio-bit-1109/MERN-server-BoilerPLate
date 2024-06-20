// middleware per cotrollare l'estensione dei file ricevuti

const path = require("path");

const fileExtentionLimiter = (allowExtArray) => {
    return (req, res, next) => {
        const file = req.files;

        const fileExtentions = [];

        Object.keys(file).forEach((key) => {
            fileExtentions.push(path.extname(file[key].name));
        });

        //are the files extentions allowed ?

        const allowed = fileExtentions.every((ext) => allowExtArray.includes(ext));

        if (!allowed) {
            return res.status(422).json({
                message: `Upload Fallito. solo i formati ${allowExtArray.join(` , `).toString()} sono consentiti.`,
            });
        }

        next();
    };
};

module.exports = fileExtentionLimiter;
