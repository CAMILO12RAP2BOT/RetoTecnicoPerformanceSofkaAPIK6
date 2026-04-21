# Conclusiones de la Prueba de Carga - Reto Sofka

## Rendimiento y Estabilidad
* **Cumplimiento de SLAs:** El sistema mantuvo un tiempo de respuesta máximo dentro del límite de **1500ms**, cumpliendo con los criterios de aceptación definidos.
* **Tasa de Éxito:** La tasa de error se mantuvo por debajo del **3%**, validando la estabilidad del endpoint bajo una carga de 20 TPS.
* **Eficiencia de VUs:** El uso dinámico de hasta **50 Usuarios Virtuales** permitió absorber la demanda sin degradar la disponibilidad del servicio.

## Hallazgos Técnicos
* **Validación de Datos:** La integración de `SharedArray` y `data.csv` garantizó una distribución aleatoria y eficiente de credenciales durante toda la prueba.
* **Consistencia Funcional:** Los `checks` confirmaron que el 100% de las peticiones exitosas retornaron el código **201** y un **token** de acceso válido.
* **Análisis de Latencia:** Los percentiles **p(90)** y **p(95)** proporcionaron una visión clara del comportamiento del servicio para la mayoría de los usuarios, descartando picos de latencia críticos.

## Recomendaciones
* **Escalabilidad:** Dado el éxito con 20 TPS, se recomienda realizar una prueba de estrés para identificar el punto de ruptura (Breakpoint) del servicio.
* **Monitoreo:** Integrar estas métricas en un dashboard de visualización para un análisis histórico, alineado con prácticas de Big Data.