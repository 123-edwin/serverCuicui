import pool from "../config/db.js";
import { codificarBase64, cifrarBase64, configurarEmisorTimbra } from "../utils/environmentUtils.js";

// Configurar emisor
export async function configurarEmisor(req, res) {
    // Extraer información del cuerpo de la solicitud
    const {
        emisor_id,
        rfc,
        certificado,
        llave,
        contrasena
    } = req.body;

    //Convertir a base 64

    const certificadoBase64 = codificarBase64(certificado);
    const llaveBase64 = codificarBase64(llave);
    const contrasenaBase64 = codificarBase64(contrasena);

    //cifrarBase64
    const certificadoCifrado = cifrarBase64(certificadoBase64);
    const llaveCifrada = cifrarBase64(llaveBase64);
    const contrasenaCifrada = cifrarBase64(contrasenaBase64);



    try {

        // ⚠️ Validar primero con el servicio externo
        const emisorResponse = await configurarEmisorTimbra(rfc, certificadoBase64, llaveBase64, contrasena);

        // Timbra marca éxito cuando Codigo === 0
        if (emisorResponse.Codigo !== 0) {
            return res.status(400).json({
                success: false,
                message: "Error al configurar emisor en timbraCFDI",
                emisorResponse,
                details: emisorResponse.Mensaje || null
            });
        }

        const querytext = `
        INSERT INTO certificados_sat (
            emisor_id,
            rfc,
            certificado_base64,
            llave_base64,
            contrasena_cifrada
        ) 
        VALUES (
        $1, $2, $3, $4, $5
        )
        RETURNING *
        `;
        const values = [
            emisor_id,
            rfc,
            certificadoCifrado,
            llaveCifrada,
            contrasenaCifrada
        ];
        const result = await pool.query(querytext, values);
        return res.status(201).json({
            success: true,
            message: "Emisor configurado correctamente",
            emisorResponse,
            data: result.rows[0]
        });
    } catch (err) {
        console.error("Error al configurar emisor:", err);
        res.status(500).json({
            error: "Error al configurar emisor",
            error: err.message || "Error desconocido",
            details: err.details || null,
            rfc: rfc
        });
    }
};