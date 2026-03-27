// Deterministic seeded LCG PRNG for reproducible item generation

export class PRNG {
  private state: number

  constructor(seed: number) {
    this.state = seed >>> 0
  }

  next(): number {
    // LCG parameters from Numerical Recipes
    this.state = (Math.imul(1664525, this.state) + 1013904223) >>> 0
    return this.state / 0x100000000
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min
  }

  nextBool(probability: number): boolean {
    return this.next() < probability
  }

  pick<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)]
  }
}

export function seedFromFloor(floor: number, killCount: number): number {
  // Mix floor and kill count for a unique seed per item drop
  return (floor * 2654435761 + killCount * 1013904223) >>> 0
}
