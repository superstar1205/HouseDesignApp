/* Validation */
export declare type INPUT_TYPE_NAME = keyof typeof INPUT_TYPE_NAME_MAP;
declare const INPUT_TYPE_NAME_MAP: {
  _EMAIL,
  _PASSWORD,
  _INPUT,
  _SELECT,
  _EQUAL,
  _MINLENGTH_MAXLENGTH_SAME,
  _PATTERN_NUM_MIN_MAX,
  _MAX_CHAR,
  _MIN_CHAR,
  _MULTIPLE_SELECT,
  _CHECK_BOX
  PASSWORD,
  MINLENGTH_MAXLENGTH_SAME,
  OTHER;
};

/* Header */
export declare type H_TYPE = keyof typeof H_TYPE_MAP;
declare const H_TYPE_MAP: {
  _BASIC;
};
export declare type H_BTN = keyof typeof H_BTN_MAP;
declare const H_BTN_MAP: {
  _BELL;
};
export declare type SELECT_MODAL_TYPE = keyof typeof SELECT_MODAL_TYPE_MAP;
declare const SELECT_MODAL_TYPE_MAP: {
  _HEAD_CLIENT;
};
