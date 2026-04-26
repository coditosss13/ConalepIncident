/**
 * Constantes de la aplicación
 */

const ROLES = {
  PROFESOR: 'profesor',
  PREFECTO: 'prefecto',
  ADMIN: 'administrador'
};

const ESTADOS_INCIDENCIA = {
  ABIERTA: 'abierta',
  EN_PROCESO: 'en_proceso',
  RESUELTA: 'resuelta',
  CERRADA: 'cerrada'
};

const SEVERIDADES = {
  LEVE: 'Leve',
  MODERADA: 'Moderada',
  GRAVE: 'Grave'
};

const TIPOS_ARCHIVO = {
  IMAGEN: 'imagen',
  PDF: 'pdf',
  DOCUMENTO: 'documento'
};

module.exports = {
  ROLES,
  ESTADOS_INCIDENCIA,
  SEVERIDADES,
  TIPOS_ARCHIVO
};