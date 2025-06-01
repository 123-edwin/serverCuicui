// utils/pdfUtils.js
import { promises as fs } from 'fs';
import { parseStringPromise } from 'xml2js';
import Handlebars from 'handlebars';
import puppeteer from 'puppeteer';
import QRcode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';

// 1) Helpers de Handlebars
Handlebars.registerHelper('moneda', valor => {
  const num = Number(valor) || 0;
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    currencyDisplay: 'symbol'
  }).format(num);
});
Handlebars.registerHelper('eq', (a, b) => a === b);




// Factura de ingreso
export async function generarFacturaIngreso(rutaXmlTimbrado) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  let browser;

  try {
    // —— 1. Leer el XML timbrado de disco
    const xmlTimbrado = await fs.readFile(rutaXmlTimbrado, 'utf-8');

    // —— 2. Parsear el XML
    const result = await parseStringPromise(xmlTimbrado, { explicitArray: false });
    const comprobante = result['cfdi:Comprobante'].$;
    const impuestos = result['cfdi:Comprobante']['cfdi:Impuestos'].$;
    const emisor = result['cfdi:Comprobante']['cfdi:Emisor'].$;
    const receptor = result['cfdi:Comprobante']['cfdi:Receptor'].$;
    const timbre = result['cfdi:Comprobante']['cfdi:Complemento']['tfd:TimbreFiscalDigital'].$;

    // —— 3. Generar URL SAT y QR
    const total = Number(comprobante.Total).toFixed(6);
    const sello = comprobante.Sello.slice(-8);
    const urlSat = [
      'https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx',
      `?id=${timbre.UUID}`,
      `&re=${emisor.Rfc}`,
      `&rr=${receptor.Rfc}`,
      `&tt=${total}`,
      `&fe=${sello}`
    ].join('');
    const qrDataUrl = await QRcode.toDataURL(urlSat);

    // —— 4. Asegurar array de conceptos
    let conceptos = result['cfdi:Comprobante']['cfdi:Conceptos']['cfdi:Concepto'];
    if (!Array.isArray(conceptos)) conceptos = [conceptos];
    const listaConceptos = conceptos.map(c => ({
      ClaveProdServ: c.$.ClaveProdServ,
      Cantidad: c.$.Cantidad,
      ClaveUnidad: c.$.ClaveUnidad,
      Unidad: c.$.Unidad,
      Descripcion: c.$.Descripcion,
      ValorUnitario: c.$.ValorUnitario,
      Importe: c.$.Importe,
      Descuento: c.$.Descuento,
      Impuesto: c['cfdi:Impuestos']
        ?.['cfdi:Traslados']
        ?.['cfdi:Traslado']?.$.Importe
    }));

    // —— 5. Leer logo
    const logoPath = path.join(__dirname, '../public/Logo.png');
    const logoBuf = await fs.readFile(logoPath);
    const logoBase64 = `data:image/png;base64,${logoBuf.toString('base64')}`;

    // —— 6. Construir datos para Handlebars
    const datosFactura = {
      LogoEmpresa: logoBase64,
      QRcode: qrDataUrl,
      Conceptos: listaConceptos,
      TipoComprobante: comprobante.TipoDeComprobante,
      Serie: comprobante.Serie,
      Folio: comprobante.Folio,
      Fecha: comprobante.Fecha,
      FormaPago: comprobante.FormaPago,
      MetodoPago: comprobante.MetodoPago,
      SubTotal: comprobante.SubTotal,
      DescuentoComprobante: comprobante.Descuento,
      Moneda: comprobante.Moneda,
      TipoCambio: comprobante.TipoCambio,
      Total: comprobante.Total,
      ImpuestosTrasladados: impuestos.TotalImpuestosTrasladados,
      Exportacion: comprobante.Exportacion,
      LugarExpedicion: comprobante.LugarExpedicion,
      NombreEmisor: emisor.Nombre,
      RfcEmisor: emisor.Rfc,
      RegimenEmisor: emisor.RegimenFiscal,
      NombreReceptor: receptor.Nombre,
      RfcReceptor: receptor.Rfc,
      RegimenReceptor: receptor.RegimenFiscalReceptor,
      UsoCFDI: receptor.UsoCFDI,
      DomicilioFiscalReceptor: receptor.DomicilioFiscalReceptor,
      UUID: timbre.UUID,
      FechaTimbrado: timbre.FechaTimbrado,
      NoCertificadoSAT: timbre.NoCertificadoSAT,
      RfcProvCertif: timbre.RfcProvCertif,
      SelloCFD: timbre.SelloCFD,
      SelloSAT: timbre.SelloSAT
    };

    // —— 7. Renderizar HTML Handlebars
    const tplPath = path.join(__dirname, '../invoice.hbs');
    const tplTxt = await fs.readFile(tplPath, 'utf-8');
    const template = Handlebars.compile(tplTxt);
    const html = template(datosFactura);

    // —— 8. Guardar HTML en disco (opcional)
    const htmlPath = path.join(__dirname, 'invoice.html');
    await fs.writeFile(htmlPath, html, 'utf-8');

    // —— 9. Generar PDF con Puppeteer y guardar
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfPath = path.join(__dirname, 'invoice.pdf');
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '1cm', bottom: '1cm', left: '1cm', right: '1cm' }
    });

    return {
      htmlPath,
      pdfPath
    };

  } catch (error) {
    throw new Error(`Error al generar factura: ${error.message}`);
  } finally {
    if (browser) await browser.close();
  }
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////



//Factura de Pago
export async function generarFacturaPago(rutaXmlTimbrado) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  let browser;

  try {
    // —— 1. Leer el XML timbrado de disco
    const xmlTimbrado = await fs.readFile(rutaXmlTimbrado, 'utf-8');

    // —— 2. Parsear el XML
    const result = await parseStringPromise(xmlTimbrado, { explicitArray: false });
    const comprobante = result['cfdi:Comprobante'].$;
    const emisor = result['cfdi:Comprobante']['cfdi:Emisor'].$;
    const receptor = result['cfdi:Comprobante']['cfdi:Receptor'].$;
    const timbre = result['cfdi:Comprobante']['cfdi:Complemento']['tfd:TimbreFiscalDigital'].$;
    const complemento = result["cfdi:Comprobante"]["cfdi:Complemento"]["pago20:Pagos"]["pago20:Pago"].$;
    const doctoRelacionado = result["cfdi:Comprobante"]["cfdi:Complemento"]["pago20:Pagos"]["pago20:Pago"]["pago20:DoctoRelacionado"].$;

    // —— 3. Generar URL SAT y QR
    const total = Number(comprobante.Total).toFixed(6);
    const sello = comprobante.Sello.slice(-8);
    const urlSat = [
      'https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx',
      `?id=${timbre.UUID}`,
      `&re=${emisor.Rfc}`,
      `&rr=${receptor.Rfc}`,
      `&tt=${total}`,
      `&fe=${sello}`
    ].join('');
    const qrDataUrl = await QRcode.toDataURL(urlSat);

    // —— 5. Leer logo
    const logoPath = path.join(__dirname, '../public/Logo.png');
    const logoBuf = await fs.readFile(logoPath);
    const logoBase64 = `data:image/png;base64,${logoBuf.toString('base64')}`;

    // —— 6. Construir datos para Handlebars
    const datosFactura = {
      LogoEmpresa: logoBase64,
      QRcode: qrDataUrl,
      TipoComprobante: comprobante.TipoDeComprobante,
      Serie: comprobante.Serie,
      Folio: comprobante.Folio,
      Fecha: comprobante.Fecha,
      LugarExpedicion: comprobante.LugarExpedicion,
      FormaPago: complemento.FormaDePagoP,
      Moneda: complemento.MonedaP,
      IdDocumento: doctoRelacionado.IdDocumento,
      SaldoAnterior: doctoRelacionado.ImpSaldoAnt,
      ImpPagado: doctoRelacionado.ImpPagado,
      ImpSaldoInsoluto: doctoRelacionado.ImpSaldoInsoluto,
      NumParcialidad: doctoRelacionado.NumParcialidad,
      LugarExpedicion: comprobante.LugarExpedicion,
      NombreEmisor: emisor.Nombre,
      RfcEmisor: emisor.Rfc,
      RegimenEmisor: emisor.RegimenFiscal,
      NombreReceptor: receptor.Nombre,
      RfcReceptor: receptor.Rfc,
      RegimenReceptor: receptor.RegimenFiscalReceptor,
      UsoCFDI: receptor.UsoCFDI,
      DomicilioFiscalReceptor: receptor.DomicilioFiscalReceptor,
      UUID: timbre.UUID,
      NoCertificadoSAT: timbre.NoCertificadoSAT,
      RfcProvCertif: timbre.RfcProvCertif,
      SelloCFD: timbre.SelloCFD,
      SelloSAT: timbre.SelloSAT
    };

    // —— 7. Renderizar HTML Handlebars
    const tplPath = path.join(__dirname, '../payment.hbs');
    const tplTxt = await fs.readFile(tplPath, 'utf-8');
    const template = Handlebars.compile(tplTxt);
    const html = template(datosFactura);

    // —— 8. Guardar HTML en disco (opcional)
    const htmlPath = path.join(__dirname, 'invoice.html');
    await fs.writeFile(htmlPath, html, 'utf-8');

    // —— 9. Generar PDF con Puppeteer y guardar
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfPath = path.join(__dirname, 'invoice.pdf');
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '1cm', bottom: '1cm', left: '1cm', right: '1cm' }
    });

    return {
      htmlPath,
      pdfPath
    };

  } catch (error) {
    throw new Error(`Error al generar factura: ${error.message}`);
  } finally {
    if (browser) await browser.close();
  }
}