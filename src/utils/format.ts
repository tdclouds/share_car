import dayjs from 'dayjs';
import durationPlugin, { DurationUnitType } from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';

dayjs.extend(durationPlugin);
dayjs.extend(utc);

export function duration(time: number, unit: DurationUnitType = 'second') {
  return dayjs.duration(time, unit).format('HH:mm:ss');
}

export function getUTCDate(timeStamp: number = Date.now()) {
  return dayjs(timeStamp).utc().format('YYYY-MM-DD HH:mm:ss');
}

export function formatPrice(price: number) {
  let res = '';
  const g = Math.floor(price / 10000);
  const s = Math.floor((price % 10000) / 100);
  const c = price % 100;
  if (g) {
    res += g + ' 金币 ';
  }
  if (s) {
    res += s + ' 银币 ';
  }
  if (c) {
    res += c + ' 铜币 ';
  }
  return res;
}
