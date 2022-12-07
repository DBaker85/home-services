export = logging;

declare let logging: {
  errorLogger: ({ err, appName }: { err: any; appName: string }) => void;
};
