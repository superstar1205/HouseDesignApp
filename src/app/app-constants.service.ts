export enum VARS {
  APP_TIMEZONE                = 'America/Los_Angeles',
  TZ_TIMEZONE_FORMAT          = 'ha z',
  DEFAULT_DATE_FORMAT         = 'dd/MM/yyyy',
  APP_TIMEZONE_LOCALES        = 'en-US',
  MSG_BACK_BUTTON             = 'Tap again to exit',
  EMAIL_PATTERN               = '^(([^<>()[\\]\\\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\\"]+)*)|(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$',
  OFFSET                      = 0,
  PAGE                        = 1,
  LIMIT_LIST                  = 15,
  SORT_BY                     = 'DESC',
  SG_HOUSEACE_USER_KEY        = 'SG_HOUSEACE_USER_KEY',
  ON_HTTP_CONNECTION_LOST     = 'The Internet connection appears to be offline, please try again later',
  ON_CONNECT_NETWORK          = 'You are online',
  ON_DISCONNECT_NETWORK       = 'You are offline. Some functionality may be unavailable',
  LOGGED_OUT                  = 'Logged out.',
  QUOTES_TEL                  = 'tel: 1300304367',
  QUOTES_MAIL                 = 'mailto: quotes@houseace.com.au',
  API_KEY                     = 'WzC#yJYU?y+PF7|',
  NUMERIC_PATTERN             = '[0-9]*',
  NUMERIC_DECIMAL_PATTERN     = '^[0-9]\\d*(\\.\\d+)?$'
}
export enum FILE_VAR {
  MULTIPLE_SELECT_DEFAULT     = 5,
  MULTIPLE_SELECT             = 5,
  MAX_SIZE_MB                 = 5,
  MAX_FILE_SIZE_DEFAULT       = 10485760,
  MAX_FILE_SIZE_5             = 5242880,
  MAX_FILE_SIZE_10            = 10485760,
  ERROR_FILE_DOWNLOAD         = 'File download failed. Please try again.',
  ERROR_NO_FILE_APP           = 'No app found to open this file type.',
  ERROR_OPENING_FILE          = 'Error opening file.',
  SUCCESS_FILE_DOWNLOAD       = 'File has been downloaded.',
  SUCCESS_FILE_BEEN_DOWNLOAD  = ' has been downloaded.',
  ALLOWED_FILE_TYPE           = 'image/jpeg,image/jpg,image/png,image/gif,image/tiff,image/pjepg,application/pdf,application/msword',
  IMG_FILE_TYPE               = 'image/jpeg,image/jpg,image/png',
  OTHER_FILE_TYPE             = 'image/jpeg,image/jpg,image/png,application/pdf',
  IMG_PDF_FILE_TYPE           = 'application/pdf',
  IMG_PDF_FILE_TYPE_EXT       = 'pdf',
  SUB_HEADER1                 = '**Allowed - jpeg, jpg, png, gif, pjepg, tiff, pdf, msword.',
  SUB_HEADER2                 = '**Allowed - jpeg, jpg, png, gif. MaxSize - 5 MB. Max 5 file(Choose from gallery).'
}
export enum APP_PAGES {
  START                       = '/start',
  ESTIMATE                    = '/tabs/Estimate',
  JOBS                        = '/tabs/Jobs',
  PAYMENTS                    = '/tabs/Payments',
  ACCOUNT                     = '/tabs/Account',
  STEPS                       = '/steps',
  DETAIL_QUOTE                = '/detail-quote',
  INVOICE_DETAIL              = '/invoice-detail',
  VIEW_PROFILE                = '/view-profile',
  LOGIN                       = '/login',
  EDIT_SCOPE                  = '/edit-scope',
  ADD_SCOPE                   = '/add-scope',
}
export enum SITE_URLS {
  BASE_URL                    = 'https://www.houseace.com.au',
  // BASE_URL                    = 'http://houseace.staging.wpengine.com',
  API_URL                     = '/app-apis',
  REQUEST_HANDLER             = '/request-handler.php',
  TERMS                       = '/terms',
  PRIVACY                     = '/privacy'
}
export enum PURPOSE {
  GET_TEMPLATE                          = 'get_template',
  APP_LOGIN                             = 'app_login',
  APP_REGISTER                          = 'app_register',
  FORGET_PASSWORD                       = 'forget_password',
  GET_FIELD                             = 'get_field',
  GET_CLIENTS_LIST                      = 'get_clients_list',
  GET_PROJECTS                          = 'get_projects',
  CANCEL_PROJECT                        = 'cancel_project',
  GET_PROJECT_DETAILS                   = 'get_project_details',
  SET_REMINDER                          = 'set_reminder',
  GET_PAYMENT_LIST                      = 'get_payment_list',
  MANAGE_TIMEFRAME                      = 'manage_timeframe',
  SAVE_QUOTE                            = 'save_quote',
  PAYMENT_LIST_ACTION                   = 'payment_list_action',
  GET_PAYMENT_DETAILS                   = 'get_payment_details',
  UPLOAD_DOCUMENTS                      = 'upload_documents',
  MANAGE_SCHEDULES                      = 'manage_schedules',
  SAVE_PAYMENT_ADJUSTMENT               = 'save_payment_adjustment',
  DELETE_PAYMENT_ADJUSTMENT             = 'delete_payment_adjustment',
  SAVE_SCHEDULE                         = 'save_schedule',
  ADD_COMMENTS                          = 'add_comments',
  GET_SCHEDULE_TEMPLATE_DETAILS         = 'get_schedule_template_details',
  GET_ACCOUNT_DETAILS                   = 'get_account_details',
  SAVE_ACCOUNT_PERSONAL_DETAILS         = 'save_account_personal_details',
  SAVE_ACCOUNT_COMPANY_SETTINGS         = 'save_account_company_settings',
  SAVE_ACCOUNT_SECURITY_SETTINGS        = 'save_account_security_settings',
  UPLOAD_LICENCE_OR_INSURANCE_DOCUMENT  = 'upload_licence_or_insurance_document',
  REMOVE_UPLOADS                        = 'remove_uploads',
  GET_REVIEW_QUOTES                     = 'get_review_qoutes',
  GET_MESSAGES                          = 'get_messages',
  UPDATE_VARIATIONS                     = 'update_variation',
  ADD_PEOPLE                            = 'add_people',
  SAVE_REVIEW                           = 'save_review',
  GET_NOTIFICATIONS                     = 'get_notifications',
  CLEAR_NOTIFICATIONS                   = 'clear_notifications',
  CLEAR_MESSAGES                        = 'clear_messages',
  CALCULATE_PRICE                       = 'calculatePrice',
  GET_SERVICES                          = 'get_services',
  MARK_SCHEDULE_DONE                    = 'mark_schedule_done',
  REMOVE_PROJECT_SCOPE                  = 'removeProjectScope',
  GET_EDIT_QUOTE_DATA                   = 'get_edit_quote_data',
  ADD_NEW_SCOPE                         = 'add_new_scope',
  SAVE_EDIT_SCOPE                       = 'save_edit_scope',
  REMOVE_PROJECT                        = 'remove_project',
  REMOVE_PEOPLE                         = 'remove_people',
  DELETE_INVOICE                        = 'delete_invoice',
}
export enum VALIDATION_MSG {
  ERR_REQUIRED_FIELD        = '*You must enter a value.',
  ERR_REQUIRED_SELECT       = '*You must select a value.',
  ERR_EMAIL_PATTERN         = '*Email format is not correct',
  ERR_FIELD_NOT_MATCH       = '*Fields do not match',
  ERR_NUMERIC_ONLY          = '*Only Numeric Values Allowed',
  ERR_GREATER_OR_EQUAL      = '*Value should be greater than or Equal to ',
  ERR_LESS_OR_EQUAL         = '*Value should be Less than or Equal to ',
  ERR_PASS_MIN_LENGTH       = '*Password must be minimum 8 characters long!',
  ERR_GREATER_THAN_ZERO     = '*Value should be greater than or Equal to 1',
  ERR_LENGTH_NOT_MATCH      = '*Length do not match.',
  ERR_PERMISSION_ALLOW      = 'Please allow camera permissions.',
  ERR_INVALID_USER          = 'Logged out due to invalid Login.',
  ERR_NOT_AUTHORISED_USER   = 'You are not authorised person. Please contact admin.',
  ERR_FILE_TYPE             = 'File type not allowed!',
  ERR_FILE_SIZE             = 'File size not allowed!',
  ERR_FILE_SIZE_AND_TYPE    = 'One or more file(s) SIZE or TYPE not allowed!',
  ERR_REQUIRED_SELECT_FILE  = '*You must select at least one file.',
  ERR_TERM_AND_PRIVACY      = '*You must accept term & condition and privacy policy.',
  ERR_LOGOUT                = 'Logged out.',
}
export enum IMGS {
  APP_LOGO              = 'assets/logo.png',
  HEADER_LOGO           = 'assets/logo.png',
  DEFAULT_LOADING       = 'assets/houserd.png',
  DEFAULT_USER_OLD      = 'assets/default-ava.png',
  DEFAULT_USER          = 'assets/default-ava2.png',
  HOUSEWT_COLOR         = 'assets/houserd.png',
  // HOUSEWT_COLOR         = 'assets/housewt-color.png',
  DEFAULT_NO_IMG        = 'assets/default.png',
  HOUSEWT               = 'assets/housewt.png',
  HOUSERD               = 'assets/houserd.png',

  NO_PROJECT            = 'assets/icon/add-img.svg',

  ADD_IMG               =  'assets/icon/add-img.svg',
  ADD4                  =  'assets/icon/add4.svg',
  ATM                   =  'assets/icon/atm.svg',
  CALENDAR2             =  'assets/icon/calendar2.svg',
  CALL_ANSWER           =  'assets/icon/call-answer.svg',
  CHECK_CIRCLE          =  'assets/icon/check-circle.svg',
  CLOUD_BACKUP_UP_ARROW =  'assets/icon/cloud-backup-up-arrow.svg',
  CONTACT               =  'assets/icon/contact.svg',
  CORRECT               =  'assets/icon/correct.svg',
  DASHBOARD             =  'assets/icon/dashboard.svg',
  FLASH                 =  'assets/icon/flash.svg',
  LOGOUT                =  'assets/icon/logout.svg',
  MAPS_AND_FLAGS        =  'assets/icon/maps-and-flags.svg',
  NOTIFICATION          =  'assets/icon/notification.svg',
  PENCIL                =  'assets/icon/pencil.svg',
  PORTFOLIO1            =  'assets/icon/portfolio1.svg',
  REMODELING            =  'assets/icon/remodeling.svg',
  RIGHT_ARROW_ANGLE1    =  'assets/icon/right-arrow-angle1.svg',
  SET_ALARM             =  'assets/icon/set-alarm.svg',
  SHIELD2               =  'assets/icon/shield2.svg',
  USER9                 =  'assets/icon/user9.svg',
}
export enum ACF_FC_LAYOUT {
  MOODS             = 'moods',
  FIELDS            = 'fields',
  ADDITIONAL_NOTES  = 'additional_notes',
  WIDTH_AND_HEIGHT  = 'width_and_height',
  EXCLUSIONS        = 'exclusions',
  WIDTH_AND_LENGTH  = 'width_and_length',
  PRICE_AND_AREA    = 'price_and_area',
  STYLES            = 'styles',
  ROOM_SIZE         = 'room_size',
  LENGTH            = 'length',
  AREA              = 'area',
  HEIGHT            = 'height',
  DISPLAY_REPEATER  = 'display_repeater'
}
export enum TYPE_OF_FIELD {
  CHECKBOX  = 'Checkbox',
  RADIO     = 'Radio'
}
export enum STORAGE_GET_DATA {
  METADATA          = 'METADATA',
  USER              = 'USER',
  USER_CAPABILITIES = 'USER_CAPABILITIES',
  COOKIE            = 'COOKIE',
  USER_ID           = 'USER_ID',
  USER_ROLE         = 'USER_ROLE'
}
export enum USER_TYPES {
  CLIENT            = 'Client',
  CONTRACTOR        = 'Contractor',
  AGENT             = 'Agent',
  SUPPLIER          = 'Supplier',
  HEAD_CONTRACTOR   = 'Head'
}
/*export enum USER_TYPES_REG {
  CLIENT      = 'Client',
  SUPPLIER    = 'Supplier',
  CONTRACTOR  = 'Contractor'
}*/
export enum USER_TYPES_REG {
  HOMEOWNERS    = 'Client',
  PARTNERS      = 'Supplier',
  TRADESPEOPLE  = 'Contractor'
}
export enum USER_TYPES_REG_TITLE {
  'Client'      = 'Homeowners',
  'Supplier'    = 'Partners',
  'Contractor'  = 'Tradespeople'
}
export enum USER_ACCOUNT_TYPE_REG {
  SUPPLIER    = 'Supplier',
  DESIGNER    = 'Designer',
  CONSULTANT  = 'Consultant'
}
export enum JOB_FILTER {
  'ALL'             = '',
  'Estimate Quote'  = 'quote',
  'Accepted Quote'  = 'live',
  'Final Quote'     = 'pending',
  'Completed Quote' = 'completed',
  'Cancelled Quote' = 'cancelled',
}

export enum QUOTE_STATUS {
  QUOTE     = 'Estimate',
  LIVE      = 'Accepted Quote',
  PENDING   = 'Final Quote',
  COMPLETED = 'Completed',
  CLOSED    = 'Closed',
}
export enum MANAGE_QUOTE_STATUS {
  'Estimate'       = 'quote',
  'Final Quote'     = 'pending',
  'Accepted Quote'  = 'live',
  'Completed'       = 'completed',
  'Cancelled'       = 'cancelled',
}
export enum NOTIFICATION_TYPES {
  APPROVED    = 'approved',
  CANCELLED   = 'cancelled',
  DONE        = 'done',
  PAID        = 'paid',
  WAITING     = 'waiting',
  ATTACHMENT  = 'attachment',
  SCHEDULE    = 'schedule',
  INVOICE     = 'invoice'
}
export enum API_KEYS {
  ONE_SIGNAL_APP_ID     = 'e791b36f-faed-4ab7-8444-2029990fa91a',
  GOOGLE_PROJECT_NUMBER = '515516264694'
}
export enum ADD_PEOPLE_SELECT {
    head_clients = 'Add Project Leader',
    head_contractors = 'Add Contractors',
    head_suplliers = 'Add Supplier',
}
