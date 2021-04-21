import { createLogger, format, transports } from 'winston';

const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${level} [${timestamp} : ${label}]\n${message}`;
});

const serverLogger = createLogger({
  format: combine(
    format.colorize(),
    label({ label: 'Server 🤖' }),
    timestamp({
      format: 'hh:mm:ss A',
    }),
    myFormat,
  ),
  transports: [new transports.Console()],
});

const heartbeatLogger = createLogger({
  format: combine(
    format.colorize(),
    label({ label: 'Heartbeat 💓' }),
    timestamp({
      format: 'hh:mm:ss A',
    }),
    myFormat,
  ),
  transports: [new transports.Console()],
});

const networkLogger = createLogger({
  format: combine(
    format.colorize(),
    label({ label: 'Network 📡' }),
    timestamp({
      format: 'hh:mm:ss A',
    }),
    myFormat,
  ),
  transports: [new transports.Console()],
});

export {
  serverLogger,
  heartbeatLogger,
  networkLogger,
};