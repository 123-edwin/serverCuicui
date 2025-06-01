// controllers/billController.js
import { promises as fs } from 'fs';
import { convertXmlToBase64, timbrarXml } from '../utils/invoiceUtils.js';
import { generarFacturaIngreso, generarFacturaPago } from '../utils/pdfUtils.js';

//Ingreso
export async function stampIncome(req, res) {
  const { xml } = req.body;
  if (!xml) {
    return res.status(400).json({ error: 'El body debe contener un campo "xml"' });
  }

  try {
    // 1) Convertir y timbrar
    const xml64 = convertXmlToBase64(xml);
    const { xmlTimbrado, path: xmlPath } = await timbrarXml(xml64);

    // 2) Generar y guardar PDF & HTML
    //    genera invoice.html e invoice.pdf dentro de utils/
    const { pdfPath } = await generarFacturaIngreso(xmlPath);

    // 3) Leer el PDF en disco y convertir a Base64
    const pdfBuffer = await fs.readFile(pdfPath);
    const pdfBase64 = pdfBuffer.toString('base64');

    // 4) Responder con JSON
    return res.json({
      success: true,
      xml: xmlTimbrado,  // cadena XML completa
      pdfBase64                // PDF en base64
    });

  } catch (err) {
    console.error('❌ Error en stampIncome:', err);
    return res.status(err.status || 500).json({
      error: err.message,
      details: err.details || null
    });
  }
}


//Pago
export async function stampPayment(req, res) {
  const { xml } = req.body;
  if (!xml) {
    return res.status(400).json({ error: 'El body debe contener un campo "xml"' });
  }

  try {
    // 1) Convertir y timbrar
    const xml64 = convertXmlToBase64(xml);
    const { xmlTimbrado, path: xmlPath } = await timbrarXml(xml64);

    // 2) Generar y guardar PDF & HTML
    //    genera invoice.html e invoice.pdf dentro de utils/
    const { pdfPath } = await generarFacturaPago(xmlPath);

    // 3) Leer el PDF en disco y convertir a Base64
    const pdfBuffer = await fs.readFile(pdfPath);
    const pdfBase64 = pdfBuffer.toString('base64');

    // 4) Responder con JSON
    return res.json({
      success: true,
      xml: xmlTimbrado,  // cadena XML completa
      pdfBase64                // PDF en base64
    });

  } catch (err) {
    console.error('❌ Error en stampIncome:', err);
    return res.status(err.status || 500).json({
      error: err.message,
      details: err.details || null
    });
  }
}