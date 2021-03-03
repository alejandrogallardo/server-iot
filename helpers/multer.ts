import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        console.log('Entre al multers')
        console.log('File: ', file);
        cb(null, 'algo' + path.extname(file.originalname))
    }
});
export default multer({storage});
