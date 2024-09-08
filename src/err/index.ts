export type ErrCode = 'NaN' | 'InvalidRange';

export interface ErrData {
  code: ErrCode;
  prevErr: null | Error;
  args: null | unknown[];
}
