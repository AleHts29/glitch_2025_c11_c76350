import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';

/**
*
* fileURLToPath: Esta función garantiza la decodificación correcta de los caracteres codificados en porcentaje, así como una cadena de ruta absoluta válida multiplataforma.
*
*/

/**
*
* dirname: Devuelve el nombre de directorio de una ruta. Similar al comando dirname de Unix.
*
*/

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname;




// Configuracion MULTER
const storage = multer.diskStorage({
    // Ubicacion de la ruta donde voy a persister los archivos
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/public/img`)
    },


    // renombre de los archivos
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`)
    }
})


export const uploader = multer({
    storage,
    // si se genera algun error, lo capturamos
    onError: function (err, next) {
        console.log(err);
        next()
    }
})