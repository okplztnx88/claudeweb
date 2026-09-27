import seedrandom from 'seedrandom';

export class RandomGenerator {
  constructor(seed = Date.now()) {
    this.rng = seedrandom(seed);
    this.seed = seed;
  }

  random() {
    return this.rng();
  }

  int(min, max) {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }

  float(min, max) {
    return this.random() * (max - min) + min;
  }

  bool(probability = 0.5) {
    return this.random() < probability;
  }

  choice(array) {
    return array[this.int(0, array.length - 1)];
  }

  weighted(options) {
    const totalWeight = options.reduce((sum, opt) => sum + opt.weight, 0);
    let random = this.random() * totalWeight;

    for (const option of options) {
      random -= option.weight;
      if (random <= 0) return option.value;
    }

    return options[options.length - 1].value;
  }

  shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  sample(array, count) {
    return this.shuffle(array).slice(0, count);
  }
}
