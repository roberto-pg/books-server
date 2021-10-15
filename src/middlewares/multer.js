const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

module.exports = {
    dest: path.resolve(__dirname, process.env.IMAGE_STORAGE),
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, process.env.IMAGE_STORAGE)
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err);
                const fileName = `${hash.toString('hex')}-${file.originalname}`;
                cb(null, fileName);
            });
        }
    }),
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/png',
            'image/jpg',
            'image/jpeg',
            'image/gif',
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalide file type.'));
        }
    },
};