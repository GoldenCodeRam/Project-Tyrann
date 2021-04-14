import { createLogger, format, transports } from 'winston';

const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `[${timestamp} : ${label}]  ${level}: ${message}`;
});

const serverLogger = createLogger({
  format: combine(
    format.colorize(),
    label({ label: "Server 🤖" }),
    timestamp({
      format: 'hh:mm:ss A',
    }),
    myFormat,
  )
});

export {
  serverLogger,
};