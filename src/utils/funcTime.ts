// 函数执行时间计算
export class TimeCalc {
  start: number = 0;
  name: string = '';
  stepPrint = false;
  step: Array<{
    name: string;
    t: number;
  }> = [];
  lock = false;

  constructor(name?: string, stepPrint?: boolean) {
    this.name = name || '';
    this.stepPrint = !!stepPrint;
    this.init();
  }

  init() {
    this.start = performance.now();
    this.step = [];
  }

  getLast() {
    if (this.step.length) {
      return this.step.slice(-1)?.[0] || {};
    }
    return {
      t: Number(this.start),
    };
  }

  addStep(name: string) {
    const p = {
      name,
      t: performance.now(),
    };

    if (this.stepPrint) {
      this.print(name, this.getLast().t - p.t);
    }

    this.step.push(p);
  }

  msParse(ms: number) {
    const f = Math.round(ms * Math.pow(10, 2)) / Math.pow(10, 2);
    return f;
  }

  print(name: string, t: number) {
    console.log(`[${this.name}]: ${name} ${this.msParse(t)}ms`);
  }

  log() {
    let last = Number(this.start);
    this.step.map((d, index) => {
      this.print(index + '-' + d.name, d.t - last);
      last = d.t;
    });
    this.print('共执行', this.getLast()?.t - this.start);
    this.init();
  }

  new() {
    return new TimeCalc();
  }
}
