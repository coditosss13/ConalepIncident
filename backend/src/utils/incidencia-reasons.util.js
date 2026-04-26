const INCIDENCIA_REASONS = [
  // NO GRAVES (de mas comun a menos comun)
  { key: 'no_uniforme', label: 'No portar el uniforme escolar', severidad_id: 1, gravedad: 'no_grave' },
  { key: 'sin_credencial', label: 'No portar la credencial escolar', severidad_id: 1, gravedad: 'no_grave' },
  { key: 'conducta_indisciplina', label: 'Incurrir en conductas inadecuadas o de indisciplina', severidad_id: 1, gravedad: 'no_grave' },
  { key: 'incumplimiento_convivencia_no_grave', label: 'Incumplimiento de las reglas de convivencia', severidad_id: 1, gravedad: 'no_grave' },
  { key: 'copia_evaluacion', label: 'Copiar cualquier proceso de evaluacion', severidad_id: 1, gravedad: 'no_grave' },

  // GRAVES (de mas comun a menos comun)
  { key: 'falta_respeto', label: 'Faltar el respeto a cualquier integrante de la comunidad', severidad_id: 3, gravedad: 'grave' },
  { key: 'agresion_fisica_verbal', label: 'Agredir fisica o verbalmente a cualquier integrante de la comunidad', severidad_id: 3, gravedad: 'grave' },
  { key: 'incumplimiento_convivencia_grave', label: 'Incumplimiento grave de las reglas de convivencia', severidad_id: 3, gravedad: 'grave' },
  { key: 'difusion_videos_dano_imagen', label: 'Difundir videos que danen la imagen de cualquier integrante', severidad_id: 3, gravedad: 'grave' },
  { key: 'falsificar_documentos', label: 'Falsificar o alterar documentacion oficial', severidad_id: 3, gravedad: 'grave' },
  { key: 'danar_infraestructura', label: 'Danar intencionalmente la infraestructura del plantel', severidad_id: 3, gravedad: 'grave' },
  { key: 'suplantar_autoridad_estudiante', label: 'Suplantar a cualquier autoridad o estudiante', severidad_id: 3, gravedad: 'grave' },
  { key: 'sustraer_documentos_herramientas', label: 'Sustraer informacion, documentos, herramientas, etc. sin autorizacion', severidad_id: 3, gravedad: 'grave' },
  { key: 'sustancias_ilicitas', label: 'Ingerir, portar, vender o comprar cualquier sustancia ilicita', severidad_id: 3, gravedad: 'grave' },
  { key: 'portar_armas', label: 'Portar y/o usar armas blancas o de fuego', severidad_id: 3, gravedad: 'grave' },
  { key: 'apoderarse_instalaciones', label: 'Apoderarse de las instalaciones', severidad_id: 3, gravedad: 'grave' },
  { key: 'cuentas_contrasenas_servidores', label: 'Apoderarse de cuentas o contrasenas de servidores publicos o de docentes', severidad_id: 3, gravedad: 'grave' },
  { key: 'cometer_delito_plantel', label: 'Cometer algun delito dentro de las instalaciones', severidad_id: 3, gravedad: 'grave' }
];

function getIncidenciaReasonsCatalog() {
  return INCIDENCIA_REASONS;
}

function resolveReason(reasonKeyOrLabel) {
  if (!reasonKeyOrLabel) return null;

  return INCIDENCIA_REASONS.find(
    (reason) => reason.key === reasonKeyOrLabel || reason.label === reasonKeyOrLabel
  ) || null;
}

module.exports = {
  getIncidenciaReasonsCatalog,
  resolveReason
};
