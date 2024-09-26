export type ErrCode = 'NaN' | 'InvalidRange' | 'WrongType';

export interface ErrData {
  code: ErrCode;
  prevErr: null | Error;
  args: null | unknown[];
}
