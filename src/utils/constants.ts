// Application constants for school backend system

export const APP_CONFIG = {
  NAME: 'School Management System',
  VERSION: '1.0.0',
  DESCRIPTION: 'Backend API for school management system',
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 4000,
  GRAPHQL_PATH: '/graphql',
  UPLOADS_PATH: '/uploads',
};

export const DATABASE_CONFIG = {
  CONNECTION_TIMEOUT: 30000,
  QUERY_TIMEOUT: 10000,
  MAX_CONNECTIONS: 100,
};

export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'school-jwt-secret',
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  ALGORITHM: 'HS256' as const,
};

export const REDIS_CONFIG = {
  HOST: process.env.REDIS_HOST || 'localhost',
  PORT: parseInt(process.env.REDIS_PORT || '6379'),
  PASSWORD: process.env.REDIS_PASSWORD,
  DB: parseInt(process.env.REDIS_DB || '0'),
  KEY_PREFIX: 'school:',
  SESSION_TTL: 86400, // 24 hours
};

export const AWS_CONFIG = {
  REGION: process.env.AWS_REGION || 'us-east-1',
  S3_BUCKET: process.env.AWS_S3_BUCKET || 'school-uploads',
  SQS_QUEUE_URL: process.env.AWS_SQS_QUEUE_URL,
  ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
};

export const EMAIL_CONFIG = {
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@school.com',
  FROM_NAME: process.env.FROM_NAME || 'School Management System',
};

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  DEFAULT_OFFSET: 0,
};

export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
  PARENT: 'PARENT',
} as const;

export const USER_STATUS = {
  ACTIVE: 1,
  INACTIVE: 0,
  SUSPENDED: 2,
  PENDING: 3,
} as const;

export const DOCUMENT_TYPES = {
  PROFILE_PICTURE: 1,
  ID_DOCUMENT: 2,
  ACADEMIC_CERTIFICATE: 3,
  MEDICAL_CERTIFICATE: 4,
  OTHER: 5,
} as const;

export const GRADE_LEVELS = {
  KINDERGARTEN: 'K',
  FIRST_GRADE: '1',
  SECOND_GRADE: '2',
  THIRD_GRADE: '3',
  FOURTH_GRADE: '4',
  FIFTH_GRADE: '5',
  SIXTH_GRADE: '6',
  SEVENTH_GRADE: '7',
  EIGHTH_GRADE: '8',
  NINTH_GRADE: '9',
  TENTH_GRADE: '10',
  ELEVENTH_GRADE: '11',
  TWELFTH_GRADE: '12',
} as const;

export const SUBJECT_CATEGORIES = {
  MATHEMATICS: 'MATHEMATICS',
  SCIENCE: 'SCIENCE',
  LANGUAGE_ARTS: 'LANGUAGE_ARTS',
  SOCIAL_STUDIES: 'SOCIAL_STUDIES',
  PHYSICAL_EDUCATION: 'PHYSICAL_EDUCATION',
  ARTS: 'ARTS',
  TECHNOLOGY: 'TECHNOLOGY',
  OTHER: 'OTHER',
} as const;

export const ATTENDANCE_STATUS = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  LATE: 'LATE',
  EXCUSED: 'EXCUSED',
} as const;

export const ASSIGNMENT_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  CLOSED: 'CLOSED',
} as const;

export const SUBMISSION_STATUS = {
  SUBMITTED: 'SUBMITTED',
  GRADED: 'GRADED',
  LATE: 'LATE',
  MISSING: 'MISSING',
} as const;

export const NOTIFICATION_TYPES = {
  ASSIGNMENT_CREATED: 'ASSIGNMENT_CREATED',
  ASSIGNMENT_DUE: 'ASSIGNMENT_DUE',
  GRADE_POSTED: 'GRADE_POSTED',
  ATTENDANCE_ALERT: 'ATTENDANCE_ALERT',
  ANNOUNCEMENT: 'ANNOUNCEMENT',
  SYSTEM_ALERT: 'SYSTEM_ALERT',
} as const;

export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  UPLOAD_TIMEOUT: 30000,
};

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/,
  STUDENT_ID_REGEX: /^[A-Z0-9]{6,12}$/,
};

export const CACHE_KEYS = {
  USER_PROFILE: 'user:profile:',
  USER_PERMISSIONS: 'user:permissions:',
  SCHOOL_CONFIG: 'school:config',
  ACTIVE_SESSIONS: 'sessions:active',
  RATE_LIMIT: 'rate:limit:',
};

export const RATE_LIMITS = {
  LOGIN_ATTEMPTS: {
    MAX_ATTEMPTS: 5,
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    BLOCK_DURATION: 30 * 60 * 1000, // 30 minutes
  },
  API_REQUESTS: {
    MAX_REQUESTS: 1000,
    WINDOW_MS: 60 * 60 * 1000, // 1 hour
  },
};

export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
} as const;

export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  PASSWORD_RESET: 'Password reset successfully',
  EMAIL_SENT: 'Email sent successfully',
};

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  INVALID_TOKEN: 'Invalid or expired token',
  ACCESS_DENIED: 'Access denied',
  VALIDATION_FAILED: 'Validation failed',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  FILE_UPLOAD_FAILED: 'File upload failed',
  RATE_LIMIT_EXCEEDED: 'Too many requests, please try again later',
};

const constants = {
  APP_CONFIG,
  DATABASE_CONFIG,
  JWT_CONFIG,
  REDIS_CONFIG,
  AWS_CONFIG,
  EMAIL_CONFIG,
  PAGINATION,
  USER_ROLES,
  USER_STATUS,
  DOCUMENT_TYPES,
  GRADE_LEVELS,
  SUBJECT_CATEGORIES,
  ATTENDANCE_STATUS,
  ASSIGNMENT_STATUS,
  SUBMISSION_STATUS,
  NOTIFICATION_TYPES,
  FILE_UPLOAD,
  VALIDATION_RULES,
  CACHE_KEYS,
  RATE_LIMITS,
  ERROR_CODES,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
};

export default constants;
