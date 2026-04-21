# Reto Técnico de Carga: Login API - Sofka

Este repositorio contiene la solución automatizada para las pruebas de rendimiento del endpoint de autenticación de *
*FakeStoreAPI**. La implementación utiliza **K6** para validar la capacidad de respuesta y estabilidad del sistema bajo
condiciones de carga controlada.

## Perfil del Proyecto

* **Herramienta:** K6 (Load Testing Tool).
* **Lenguaje:** JavaScript.
* **Escenario:** Tasa de llegada constante (`constant-arrival-rate`).
* **Objetivo:** Evaluar el cumplimiento de los acuerdos de nivel de servicio (SLA) en el proceso de login.

## Estructura del Directorio

```text
.
├── datos/
│   └── data.csv            # Credenciales de prueba (user, passwd)
├── scripts/
│   └── reto_login_sofka.js # Script de automatización en K6
└── scripts/reportes/       # Reportes generados automáticamente (.md)
```

### Configuración del Escenario de Carga

| Parámetro         | Valor                 | Descripción                                                                           |
|-------------------|-----------------------|---------------------------------------------------------------------------------------|
| Executor          | constant-arrival-rate | Mantiene una tasa de peticiones constante independientemente del tiempo de respuesta. |
| Rate              | 20                    | Se ejecutan 20 peticiones por segundo (TPS).                                          |
| Duration          | 1m                    | Tiempo total de la ejecución de la prueba.                                            |
| Pre-allocated VUs | 10                    | Usuarios virtuales reservados al inicio de la prueba.                                 |
| Max VUs           | 50                    | Límite máximo de usuarios virtuales disponibles para escalar.                         |

### Umbrales de Calidad (Thresholds)
La prueba se marca como exitosa si se cumplen los siguientes criterios técnicos:
- **http_req_duration:** El tiempo máximo (max) de respuesta debe ser <= 1500ms. 
- **http_req_failed:** La tasa de errores debe ser inferior al 3% (rate < 0.03).

## Comando de Ejecución
Ejecuta el siguiente comando desde la carpeta donde se encuentra el script:

```
k6 run reto_login_sofka.js
```

### Reportes y Resultados
El script incluye una función personalizada handleSummary que procesa las métricas finales y genera:

1. **Resumen en Consola:** Visualización inmediata de las métricas estándar de K6. 
2. **Archivo de Reporte (.md):** Genera un archivo en la carpeta reportes/ con la fecha y hora de ejecución (ej: reporte_21_04_2026_15_10_00.md).

El reporte detallado incluye:
- Validación de cumplimiento de los Thresholds. 
- Percentiles 90 y 95 de latencia, cruciales para el análisis de rendimiento en Big Data. 
- Total de peticiones y promedio de transacciones por segundo (TPS).

### Detalles de Implementación
* Optimización de Memoria: Uso de SharedArray para cargar datos masivos de forma eficiente. 
* Validaciones (Checks): Se valida que el servidor responda con estado 201 y entregue un token de autenticación. 
* Escalabilidad: Configuración preparada para ajustar el número de VUs según la demanda de los TPS definidos.

**Desarrollado por:** Camilo Andres Amaya Granados
**Rol:** 

Analista de calidad manual/ Automatizador de pruebas/  Estudiante de Especialización en Big Data

** Fecha de actualización:** 21 de Abril 2026