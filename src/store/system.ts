import { defineStore } from 'pinia';

export const useSystemStore = defineStore('system', {
  state(): {
    timer?: NodeJS.Timeout;
    timeStamp: number;
  } {
    return {
      timer: undefined,
      timeStamp: 0,
    };
  },
  actions: {
    initTimeStamp(timeStamp: number) {
      this.timeStamp = timeStamp;
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.timeStamp += 1000;
      }, 1000);
    },
  },
});
