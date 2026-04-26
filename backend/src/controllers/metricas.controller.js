const metricasService = require('../services/metricas.service');
const { asyncHandler } = require('../middlewares/error.middleware');

class MetricasController {

  /**
   * GET /api/metricas/dashboard
   * Obtener dashboard completo de métricas
   */
  getDashboard = asyncHandler(async (req, res) => {
    const { fechaInicio, fechaFin, grupo_id, severidad_id } = req.query;

    const dashboard = await metricasService.getDashboard({
      fechaInicio,
      fechaFin,
      grupo_id,
      severidad_id
    });

    res.json({
      success: true,
      data: dashboard
    });
  });

  /**
   * GET /api/metricas/resumen
   * Obtener resumen rápido de métricas (para cards)
   */
  getResumen = asyncHandler(async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;

    const resumen = await metricasService.getResumen({
      fechaInicio,
      fechaFin
    });

    res.json({
      success: true,
      data: resumen
    });
  });
}

module.exports = new MetricasController();
