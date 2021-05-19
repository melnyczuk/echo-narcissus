import { JSON } from 'globalthis/implementation';

enum MsgType {
  OK = 'OK',
  ERROR = 'ERROR',
  SETTINGS = 'SETTINGS',
  POSE = 'POSE',
  IMAGE = 'IMAGE',
}

export type Settings = {
  host: string;
  port: number;
  model_dir: string;
};

export type MSG<T> = {
  type: MsgType;
  data: T;
};

const msg =
  <T>(type: MSG<T>['type']) =>
  (data?: T): string => {
    const message: MSG<T> = { type, data };
    return JSON.stringify(message);
  };

export const okMsg = msg<void>(MsgType.OK);
export const errorMsg = msg<Error>(MsgType.ERROR);
export const settingsMsg = msg<Settings>(MsgType.SETTINGS);
