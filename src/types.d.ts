export type ErrCode =
  | 'NaN'
  | 'InvalidRange'
  | 'WrongType'
  | 'DeepCopyFailed'
  | 'EmptyCollection'
  | 'EmptySlot'
  | 'UnknownError';

export interface ErrData {
  code: ErrCode;
  prevErr: null | Error;
  args: null | unknown[];
}

export interface Segment<T> {
  readonly start: T;
  readonly end: T;
  includes: (value: T) => boolean | Error;
}
