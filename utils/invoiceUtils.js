// utils/invoiceUtils.js
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Convierte un string XML a Base64 (sólo para el envío al PAC)
export function convertXmlToBase64(xml) {
  return Buffer.from(xml, 'utf8').toString('base64');
}

// Timbrar en el PAC y guardar el XML plano que regresa
export async function timbrarXml(xmlBase64, idComprobante = 'id_123ABC') {
  const url = 'https://pruebas.timbracfdi33.mx:1444/api/v2/Timbrado/TimbraCFDI';
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: 'Bearer mvpNUXmQfK8='
    },
    body: JSON.stringify({
      XmlComprobanteBase64: xmlBase64,
      IdComprobante: idComprobante
    })
  };

  // 1) Hacemos la petición
  const response = await fetch(url, options);
  const data = await response.json().catch(() => {
    throw new Error('No se pudo parsear la respuesta como JSON');
  });
  if (!response.ok) {
    const err = new Error('Error al timbrar');
    err.status = response.status;
    err.details = data;
    throw err;
  }

  // 2) data.Xml ya es un string de XML UTF-8
  let xmlTimbrado = data.Xml;

  xmlTimbrado = xmlTimbrado.replace(/^\uFEFF/, '');
  //  Quita espacios/saltos de línea al principio
  xmlTimbrado = xmlTimbrado.trimStart();

  // 3) Guardar en disco dentro de utils/
  const __filename = fileURLToPath(import.meta.url);
  const __dirname  = path.dirname(__filename);
  const salidaPath = path.join(__dirname, 'timbrado.xml');
  await fs.writeFile(salidaPath, xmlTimbrado, 'utf-8');

  // 4) Devolver el texto y la ruta
  return {
    xmlTimbrado,
    path: salidaPath
  };
}
