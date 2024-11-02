export const FIELD = { 
  USER_EMAIL_MAX_LENGTH: 50,
  USER_PASSWORD_MAX_LENGTH: 25,
   
  USER_FIRST_NAME_MAX_LENGTH: 50,
  USER_LAST_NAME_MAX_LENGTH: 50,

  EXPEDIENT_CODE_MAX_LENGTH: 100,
  EXPEDIENT_SUBJECT_MAX_LENGTH: 100,
  EXPEDIENT_PROCESS_MAX_LENGTH: 100,
  EXPEDIENT_COURT_MAX_LENGTH: 100,
  EXPEDIENT_STATUS_DESCRIPTION_MAX_LENGTH: 255,

  PART_NAME_MAX_LENGTH: 50,

  DOCUMENT_NAME_MAX_LENGTH: 200,
  DOCUMENT_KEY_MAX_LENGTH: 100
}

export enum EXPEDIENT_STATUS {
  TACHADO = 'TACHADO',
  SANEADO = 'SANEADO',
  APELADO = 'APELADO',
  EN_EJECUCION = 'EN_EJECUCION',
  EN_PROCESO = 'EN_PROCESO',
  EN_TRAMITE = 'EN_TRAMITE',
  FINALIZADO = 'FINALIZADO',
  RECHAZADO = 'RECHAZADO',
  SENTENCIADO = 'SENTENCIADO',
  RESUELTO = 'RESUELTO'
}

export enum PART_TYPES {
  DENUNCIANTE = 'DENUNCIANTE',
  DENUNCIADO = 'DENUNCIADO'
}

export enum USER_ROLES {
  ADMIN = 'ADMIN',
  ABOGADO = 'ABOGADO',
  PRACTICANTE = 'PRACTICANTE'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: USER_ROLES;
  createdExpedients?: Expedient[];
  updatedExpedients?: Expedient[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Expedient {
  id: string;
  code: string;
  subject: string;
  process: string;
  court: string;
  status: EXPEDIENT_STATUS;
  statusDescription?: string;
  createdByUser?: User;
  updatedByUser?: User;
  parts: Part[];
  reviews: Review[];
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;

  dataIndex: string;
  key: string;
}

export interface Part {
  id: string;
  name: string;
  type: PART_TYPES;
  expedient?: Expedient;
}

export interface Review {
  id: string;
  description: string;
  expedient?: Expedient;
  updatedByUser?: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  expedient?: Expedient;
  createdByUser?: User;
  updatedByUser?: User;
  createdAt: Date;
  updatedAt: Date;
}
