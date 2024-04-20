import dayjs from 'dayjs';
import durationPlugin, { DurationUnitType } from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';

dayjs.extend(durationPlugin);
dayjs.extend(utc);

export function duration(time: number, unit?: DurationUnitType) {
  return dayjs.duration(time, unit).format('HH:mm:ss');
}

export function getUTCDate(timeStamp: number = Date.now()) {
  return dayjs(timeStamp).utc().format('YYYY-MM-DD HH:mm:ss');
}
