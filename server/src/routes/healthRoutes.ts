import { Application } from 'express';

interface HealthResponse {
  uptime: string;
}

function pad(s: number) {
  return (s < 10 ? '0' : '') + s;
}

function format(inputSeconds: number): string {
  const hours = Math.floor(inputSeconds / (60 * 60));
  const minutes = Math.floor((inputSeconds % (60 * 60)) / 60);
  const seconds = Math.floor(inputSeconds % 60);

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

const getUptime = (): string => {
  const upTime = process.uptime();
  return format(upTime);
};

module.exports = (app: Application) => {
  app.get('/health', (req, res) => {
    // We want to send back some basic information about the application
    const response: HealthResponse = {
      uptime: getUptime(),
    };
    res.json(response);
  });
};
