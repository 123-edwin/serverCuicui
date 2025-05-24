import pool from '../config/db.js';

// Obtener todos los clientes
export async function getClients(req, res) {
    try {
        const result = await pool.query('SELECT * FROM clientes');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener clientes' });
    }
}

// Crear un nuevo cliente
export async function createClient(req, res) {
    // Extrae los campos desde el body (ajusta nombres si tu front-end usa otros)
    const {
        empresa,
        contacto_principal,
        email_principal,
        telefono,
        activo,
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
        fecha_termino_dominio
    } = req.body;

    try {
        // Consulta parametrizada para evitar inyección SQL
        const queryText = `
      INSERT INTO clientes (
        empresa,
        contacto_principal,
        email_principal,
        telefono,
        activo,
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
        fecha_termino_dominio
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *;
    `;
        const values = [
            empresa,
            contacto_principal,
            email_principal,
            telefono,
            activo,
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
            fecha_termino_dominio
        ];

        const result = await pool.query(queryText, values);

        // Devuelve el cliente creado
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error al crear cliente:', err);
        res.status(500).json({ error: 'Error al crear cliente' });
    }
}

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
