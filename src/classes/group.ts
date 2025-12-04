// Represents a team in the tournament.

import Team from './team';

export default class Group {
  // The name of the group.
  groupName: string = '';
  // The teams that are in the group.
  teams: Team[] = [];

  constructor(name: string) {
    this.groupName = name;

    // Adds placeholder names for each team in the group
    for (let i = 0; i < 4; i++) {
      this.teams.push(new Team(`${name}${i + 1}`));
    }
  }

  // Returns the number of known teams in the group
  numberOfTeams(): number {
    return this.teams.filter((t) => t.pot != 0).length;
  }

  // Gets the number of teams from a confederation in the group
  getConfederationTeams(confederation: string): number {
    const confederations = this.teams.map((t) => t.confederation).flat();
    return confederations.filter((c) => c === confederation).length;
  }

  getConfederations() {
    return this.teams.map((t) => t.confederation).flat();
  }
}
