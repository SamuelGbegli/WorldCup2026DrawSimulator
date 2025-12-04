// Class to help visualise the nature of the draw

export default class DrawResult {
  team: string = '';
  pot: string = '';
  position: string = '';

  constructor(team: string, pot: string, position: string) {
    this.team = team;
    this.pot = pot;
    this.position = position;
  }
}
