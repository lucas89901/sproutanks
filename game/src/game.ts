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
  cost?: number | 'N/A';
  seed?: number | 'N/A';
};

const results: Result[] = [];
export function addResult(result: Result): void {
  if (result.mode === 'agent') {
    result.cost = result.movements * 3 + result.rotations * 2 + result.shots;
  } else {
    result.cost = 'N/A';
  }
  if (parseInt(result.level[result.level.length - 1], 10) < 5) {
    result.seed = 'N/A';
  }
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
      <td>${result.seed}</td>
    </tr>`;
}
export function getResults(): Result[] {
  return results;
}
