import crypto from 'crypto';
import { response } from 'express';

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const ENCRYPTION_IV = process.env.ENCRYPTION_IV;

if (!ENCRYPTION_KEY || !ENCRYPTION_IV) {
    throw new Error("Faltan ENCRYPTION_KEY o ENCRYPTION_IV en el archivo .env");
}


 //Convierte un texto en base64
 
export function codificarBase64(texto) {
    if (typeof texto !== 'string') {
        throw new TypeError('El texto debe ser una cadena de caracteres');
    }
    return Buffer.from(texto, 'utf8').toString('base64');
}


 // Cifra un texto base64 y lo devuelve en base64 cifrado

export function cifrarBase64(base64Texto) {
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), Buffer.from(ENCRYPTION_IV));
    let encrypted = cipher.update(base64Texto, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}


 // Descifra el texto cifrado (en base64) y devuelve el contenido base64 original
export function descifrarBase64Cifrado(textoCifrado) {
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), Buffer.from(ENCRYPTION_IV));
    let decrypted = decipher.update(textoCifrado, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted; // Este es el texto base64 original
}


 // Decodifica un texto en base64 a UTF-8
export function decodificarBase64(textoBase64) {
    if (typeof textoBase64 !== 'string') {
        throw new TypeError('El texto base64 debe ser una cadena de caracteres');
    }
    return Buffer.from(textoBase64, 'base64').toString('utf8');
}

export async function configurarEmisorTimbra(rfc, certificado, llave, contrasena) {
  const url = "https://pruebas.timbracfdi33.mx:1444/api/v2/Timbrado/RegistraEmisor";
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: "Bearer mvpNUXmQfK8="
    },
    body: JSON.stringify({
      RfcEmisor:  rfc,
      Base64Cer:  certificado,
      Base64Key:  llave,
      Contrasena: contrasena
    })
  };

  const response = await fetch(url, options);
  let data;
  try {
    data = await response.json();
  } catch (parseErr) {
    console.error("❌ Timbra respondió, pero NO pudo parsear JSON:", parseErr);
    throw new Error("No se pudo parsear la respuesta como JSON");
  }

  // <-- Aquí imprime TODO el objeto data y el status:
  console.log("🔵 [Timbra] status:", response.status);
  console.log("🔵 [Timbra] JSON completo:", JSON.stringify(data, null, 2));

  if (!response.ok) {
    const err = new Error("Error al configurar emisor en Timbra");
    err.status = response.status;
    err.details = data;
    throw err;
  }

  return data;
}

