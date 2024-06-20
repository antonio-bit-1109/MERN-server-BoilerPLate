const filePayloadExist = (req, res, next) => {
    if (!req.files) return res.status(400).json({ message: "nessun file fornito." });

    next();
};

module.exports = filePayloadExist;
