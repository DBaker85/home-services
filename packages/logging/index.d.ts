declare type Logger = {
  log: (msg: string, dateStamp?: string) => void;
  warn: (msg: string, dateStamp?: string) => void;
  error: (msg: string, dateStamp?: string) => void;
};

declare const logToConsole: (appName: string) => Logger;

declare const logToFile: (appName: string) => {
  error: (err: any) => void;
};

export { logToConsole, logToFile };
