import http from 'k6/http';
import { check } from 'k6';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';

// Se carga el archivo en memoria
const DATOS_CSV = new SharedArray('Usuarios', function () {
  return papaparse.parse(open('../datos/data.csv'), { header: true }).data;
});

// Se configura el escenario K6 con los parametros del reto
export const options = {
  scenarios: {
    reto_login_sofka: {
      executor: 'constant-arrival-rate',
      rate: 20,
      timeUnit: '1s',
      duration: '1m',
      preAllocatedVUs: 10,
      maxVUs: 50, 
    },
  },
  thresholds: {
    // El tiempo de respuesta máximo permitido es de 1.5 segundos (1500 ms)
    http_req_duration: ['max<=1500'],
    // La tasa de error debe ser menor al 3% (0.03)
    http_req_failed: ['rate<0.03'],
  },
};

export default function () {
  // Seleccionar un conjunto de datos aleatorio para la petición
  const usuarioAleatorio = DATOS_CSV[Math.floor(Math.random() * DATOS_CSV.length)];
  // Host WS
  const host = 'https://fakestoreapi.com/auth/login';
  // Body Petición
  const cuerpo = JSON.stringify({
    username: usuarioAleatorio.user,
    password: usuarioAleatorio.passwd,
  });
  // Headers Petición
  const parametros = {
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: '60s',
  };

  // Realizar la petición POST
  const peticion = http.post(host, cuerpo, parametros);

  // Validaciones del response
  check(peticion, {
    'Estado es 201': (r) => r.status === 201,
    'Token generado': (r) => r.json('token') !== undefined,
  });
}

export function handleSummary(data) {

  const fecha = new Date();

  const formatoDoble = (numero) => numero.toString().padStart(2, '0');

  const dia = formatoDoble(fecha.getDate());
  const mes = formatoDoble(fecha.getMonth() + 1);
  const anio = fecha.getFullYear();
  const hora = formatoDoble(fecha.getHours());
  const minuto = formatoDoble(fecha.getMinutes());
  const segundo = formatoDoble(fecha .getSeconds());

  const nombreArchivo = `reporte_${dia}_${mes}_${anio}_${hora}_${minuto}_${segundo}.md`;
 // Ruta Reporte
  const rutaReporte = `./reportes/${nombreArchivo}`;
  // Construimos el contenido del archivo Markdown
  const reporteMarkdown = `# Reporte de Pruebas de Carga - Reto Técnico Sofka

**Fecha de ejecución:** ${new Date().toLocaleString()}

## Resumen de Umbrales (Thresholds)
* **Tiempo máximo de respuesta (Esperado <= 1500ms):** ${data.metrics.http_req_duration.values.max <= 1500 ? 'Cumple' : 'No Cumple'} (${data.metrics.http_req_duration.values.max.toFixed(2)} ms)
* **Tasa de error (Esperado < 3%):** ${data.metrics.http_req_failed.values.rate < 0.03 ? 'Cumple' : 'No Cumple'} (${(data.metrics.http_req_failed.values.rate * 100).toFixed(2)}%)

## Estadísticas de Peticiones HTTP
* **Total de Peticiones Procesadas:** ${data.metrics.http_reqs.values.count}
* **Transacciones por Segundo (TPS):** ${data.metrics.http_reqs.values.rate.toFixed(2)} TPS
* **Tiempo Promedio de Respuesta:** ${data.metrics.http_req_duration.values.avg.toFixed(2)} ms
* **Tiempo Máximo de Respuesta:** ${data.metrics.http_req_duration.values.max.toFixed(2)} ms
* **Percentil 95 (El 95% de las peticiones tardaron menos de):** ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)} ms
* **Percentil 90 (El 90% de las peticiones tardaron menos de):** ${data.metrics.http_req_duration.values['p(90)'].toFixed(2)} ms

## Usuarios Virtuales (VUs)
* **VUs Concurrentes Máximos Utilizados:** ${data.metrics.vus.values.max}

---
*Reporte generado automáticamente por K6 al finalizar la ejecución del script.*
  `;

  return {
    // 1. Mantiene la impresión estándar en la consola
    'stdout': textSummary(data, { indent: ' ', enableColors: true }), 
    
    // 2. Crea o sobrescribe el archivo Markdown en la ruta donde ejecutas el script
    [rutaReporte]: reporteMarkdown, 
  };
}