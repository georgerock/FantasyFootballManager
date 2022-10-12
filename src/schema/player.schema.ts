export type Position = 'Attack' | 'Midfield' | 'Defense' | 'Goalkeeper';
export type PlayerData = {
  firstName: string,
  lastName: string,
  countryId: number,
  position: Position,
  age: number,
  teamId: number
}