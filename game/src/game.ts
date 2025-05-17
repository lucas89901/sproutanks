let mode = 'manual';
export function setMode(newMode: string): void {
  mode = newMode.toLowerCase();
}
export function getMode(): string {
  return mode;
}

export type Result = {
  level: string;
  result: 'win' | 'lose';
  mode: string;
  movements: number;
  rotations: number;
  shots: number;
  cost?: number;
};

const results: Result[] = [];
export function addResult(result: Result): void {
  result.cost = result.movements * 3 + result.rotations * 2 + result.shots;
  results.push(result);
  document
    .getElementById('results')!
    .getElementsByTagName('tbody')![0].innerHTML += `
    <tr>
      <td>${result.level}</td>
      <td>${result.result}</td>
      <td>${result.mode}</td>
      <td>${result.movements}</td>
      <td>${result.rotations}</td>
      <td>${result.shots}</td>
      <td>${result.cost}</td>
    </tr>`;
}
export function getResults(): Result[] {
  return results;
}
