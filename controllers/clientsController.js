import pool from '../config/db.js';

//Obtener un sólo cliente
export async function getOnlyClient(req, res) {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM clientes WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener cliente' });
    }
}
// Obtener todos los clientes
export async function getClients(req, res) {
    try {
        const result = await pool.query('SELECT * FROM clientes ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener clientes' });
    }
}

// Crear un nuevo cliente
export async function createClient(req, res) {
    // Extrae los campos desde el body
    const {
        empresa,
        telefono,
        tipo_cliente,
        dominio,
        respaldo_renovacion_sitio_web,
        plan_diseno_web,
        plan_redes_sociales,
        fecha_inicio_redes,
        fecha_renovacion_redes,
        servidor_ubicacion,
        fecha_inicio_servidor,
        fecha_termino_servidor,
        dominio_ubicacion,
        fecha_inicio_dominio,
        fecha_termino_dominio,
        contacto_principal,
        email_principal,
        activo,
        website,
        moneda,
        direccion,
        localidad,
        provincia,
        codigo_postal,
        pais,
        razon_social,
        rfc,
        regimen,
        diseno_grafico,
        produccion,
        instagram_usuario,
        instagram_contrasena,
        youtube_usuario,
        youtube_contrasena,
        servidor_usuario,
        servidor_contrasena,
        wordpress_usuario,
        wordpress_contrasena,
        observaciones,
        correo_electronicos_corporativos,
        cobro_calle,
        cobro_localidad,
        cobro_departamento,
        cobro_codigo_postal,
        cobro_pais,
        envio_calle,
        envio_localidad,
        envio_departamento,
        envio_codigo_postal,
        envio_pais
    } = req.body;

    try {
        // Consulta parametrizada para evitar inyección SQL
        const queryText = `
  INSERT INTO clientes (
    empresa,
    telefono,
    tipo_cliente,
    dominio,
    respaldo_renovacion_sitio_web,
    plan_diseno_web,
    plan_redes_sociales,
    fecha_inicio_redes,
    fecha_renovacion_redes,
    servidor_ubicacion,
    fecha_inicio_servidor,
    fecha_termino_servidor,
    dominio_ubicacion,
    fecha_inicio_dominio,
    fecha_termino_dominio,
    contacto_principal,
    email_principal,
    activo,
    website,
    moneda,
    direccion,
    localidad,
    provincia,
    codigo_postal,
    pais,
    razon_social,
    rfc,
    regimen,
    diseno_grafico,
    produccion,
    instagram_usuario,
    instagram_contrasena,
    youtube_usuario,
    youtube_contrasena,
    servidor_usuario,
    servidor_contrasena,
    wordpress_usuario,
    wordpress_contrasena,
    observaciones,
    correo_electronicos_corporativos,
    cobro_calle,
    cobro_localidad,
    cobro_departamento,
    cobro_codigo_postal,
    cobro_pais,
    envio_calle,
    envio_localidad,
    envio_departamento,
    envio_codigo_postal,
    envio_pais
  )
  VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
    $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
    $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
    $31, $32, $33, $34, $35, $36, $37, $38, $39, $40,
    $41, $42, $43, $44, $45, $46, $47, $48, $49, $50
  )
  RETURNING *;
`;

        const values = [
            empresa,
            telefono,
            tipo_cliente,
            dominio,
            respaldo_renovacion_sitio_web,
            plan_diseno_web,
            plan_redes_sociales,
            fecha_inicio_redes,
            fecha_renovacion_redes,
            servidor_ubicacion,
            fecha_inicio_servidor,
            fecha_termino_servidor,
            dominio_ubicacion,
            fecha_inicio_dominio,
            fecha_termino_dominio,
            contacto_principal,
            email_principal,
            activo,
            website,
            moneda,
            direccion,
            localidad,
            provincia,
            codigo_postal,
            pais,
            razon_social,
            rfc,
            regimen,
            diseno_grafico,
            produccion,
            instagram_usuario,
            instagram_contrasena,
            youtube_usuario,
            youtube_contrasena,
            servidor_usuario,
            servidor_contrasena,
            wordpress_usuario,
            wordpress_contrasena,
            observaciones,
            correo_electronicos_corporativos,
            cobro_calle,
            cobro_localidad,
            cobro_departamento,
            cobro_codigo_postal,
            cobro_pais,
            envio_calle,
            envio_localidad,
            envio_departamento,
            envio_codigo_postal,
            envio_pais
        ];

        const result = await pool.query(queryText, values);

        // Devuelve el cliente creado
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error al crear cliente:', err);
        res.status(500).json({ error: 'Error al crear cliente' });
    }
}

//Actualizar cliente
export async function updateClient(req, res) {
    const { id } = req.params;
    const {
        empresa,
        telefono,
        tipo_cliente,
        dominio,
        respaldo_renovacion_sitio_web,
        plan_diseno_web,
        plan_redes_sociales,
        fecha_inicio_redes,
        fecha_renovacion_redes,
        servidor_ubicacion,
        fecha_inicio_servidor,
        fecha_termino_servidor,
        dominio_ubicacion,
        fecha_inicio_dominio,
        fecha_termino_dominio,
        contacto_principal,
        email_principal,
        activo,
        website,
        moneda,
        direccion,
        localidad,
        provincia,
        codigo_postal,
        pais,
        razon_social,
        rfc,
        regimen,
        diseno_grafico,
        produccion,
        instagram_usuario,
        instagram_contrasena,
        youtube_usuario,
        youtube_contrasena,
        servidor_usuario,
        servidor_contrasena,
        wordpress_usuario,
        wordpress_contrasena,
        observaciones,
        correo_electronicos_corporativos,
        cobro_calle,
        cobro_localidad,
        cobro_departamento,
        cobro_codigo_postal,
        cobro_pais,
        envio_calle,
        envio_localidad,
        envio_departamento,
        envio_codigo_postal,
        envio_pais
    } = req.body;

    try {
        const queryText = `
            UPDATE clientes SET
                empresa = $1,
                telefono = $2,
                tipo_cliente = $3,
                dominio = $4,
                respaldo_renovacion_sitio_web = $5,
                plan_diseno_web = $6,
                plan_redes_sociales = $7,
                fecha_inicio_redes = $8,
                fecha_renovacion_redes = $9,
                servidor_ubicacion = $10,
                fecha_inicio_servidor = $11,
                fecha_termino_servidor = $12,
                dominio_ubicacion = $13,
                fecha_inicio_dominio = $14,
                fecha_termino_dominio = $15,
                contacto_principal = $16,
                email_principal = $17,
                activo = $18,
                website = $19,
                moneda = $20,
                direccion = $21,
                localidad = $22,
                provincia = $23,
                codigo_postal = $24,
                pais = $25,
                razon_social = $26,
                rfc = $27,
                regimen = $28,
                diseno_grafico = $29,
                produccion = $30,
                instagram_usuario = $31,
                instagram_contrasena = $32,
                youtube_usuario = $33,
                youtube_contrasena = $34,
                servidor_usuario = $35,
                servidor_contrasena = $36,
                wordpress_usuario = $37,
                wordpress_contrasena = $38,
                observaciones = $39,
                correo_electronicos_corporativos = $40,
                cobro_calle = $41,
                cobro_localidad = $42,
                cobro_departamento = $43,
                cobro_codigo_postal = $44,
                cobro_pais = $45,
                envio_calle = $46,
                envio_localidad = $47,
                envio_departamento = $48,
                envio_codigo_postal = $49,
                envio_pais = $50
            WHERE id = $51
            RETURNING *;
        `;

        const values = [
            empresa,
            telefono,
            tipo_cliente,
            dominio,
            respaldo_renovacion_sitio_web,
            plan_diseno_web,
            plan_redes_sociales,
            fecha_inicio_redes,
            fecha_renovacion_redes,
            servidor_ubicacion,
            fecha_inicio_servidor,
            fecha_termino_servidor,
            dominio_ubicacion,
            fecha_inicio_dominio,
            fecha_termino_dominio,
            contacto_principal,
            email_principal,
            activo,
            website,
            moneda,
            direccion,
            localidad,
            provincia,
            codigo_postal,
            pais,
            razon_social,
            rfc,
            regimen,
            diseno_grafico,
            produccion,
            instagram_usuario,
            instagram_contrasena,
            youtube_usuario,
            youtube_contrasena,
            servidor_usuario,
            servidor_contrasena,
            wordpress_usuario,
            wordpress_contrasena,
            observaciones,
            correo_electronicos_corporativos,
            cobro_calle,
            cobro_localidad,
            cobro_departamento,
            cobro_codigo_postal,
            cobro_pais,
            envio_calle,
            envio_localidad,
            envio_departamento,
            envio_codigo_postal,
            envio_pais,
            id
        ];

        const result = await pool.query(queryText, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        res.json({
            message: 'Cliente actualizado correctamente',
            updatedClient: result.rows[0]
        });
    } catch (err) {
        console.error('Error al actualizar cliente:', err);
        res.status(500).json({ error: 'Error al actualizar cliente' });
    }
}

//Eliminar cliente

export async function deleteClient(req, res) {
    const { id } = req.params; // Obtiene el id desde la URL
    try {
        // Retornamos el registro eliminado para confirmar o manejarlo en el front
        const result = await pool.query(
            'DELETE FROM clientes WHERE id = $1 RETURNING *',
            [id]
        );

        // Si no existe ningún registro con ese id
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'No se encontró el cliente con ese ID' });
        }

        // Retornamos el cliente que se eliminó
        res.json({
            message: 'Cliente eliminado correctamente',
            deletedClient: result.rows[0]
        });
    } catch (err) {
        console.error('Error al eliminar cliente:', err);
        res.status(500).json({ error: 'Error al eliminar cliente' });
    }
}
