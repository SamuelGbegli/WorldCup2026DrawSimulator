/*
  Represents a team competing in the 2026 FIFA World Cup. This also
  includes placeholder teams due to complete in the FIFA and UEFA
  play-off teams.
*/

export default class Team {
  // The name of the team competing.
  name: string = '';
  // A URL to the flag of the team competing, or placeholder logos for
  // teams competing in play-offs.
  flag: string = '';
  // The draw pot the team will be assignted to.
  pot: number = 0;
  // The confederation the team belongs to. For placeholder teams in the
  // inter-confederation play-offs, the confederations of all the teams
  // taking part are listed.
  confederation: string[] = [];
  // The group the team will be assigned to in the draw. Only applies to
  // Mexico, Canada and the United States.
  group: string | null = null;
  // The position in the group the competitor will be assigned to. Only
  // applies to teams in pot 1.
  groupPosition: number | null = null;
  // The rank of the team in the FIFA Men's World Rankings in November 2025.
  // Does not apply to placeholder teams.
  rank: number | null = null;
  // Holds the names of teams in a play-off path. Only applies to placeholder
  // teams.
  placeholderTeams: string[] = [];
  // If true, means the team has been added to a group.
  isDrawn: boolean = false;

  constructor(name: string | undefined) {
    if (name != undefined) this.name = name;
  }

  // Adds values from a JSON object
  populateValues(item: any): void {
    this.flag = item.Flag;
    this.pot = item.Pot;

    if (typeof item['Confederation(s)'] == 'string')
      this.confederation.push(item['Confederation(s)']);
    else this.confederation = item['Confederation(s)'];

    if (item.Group != undefined) this.group = item.Group;
    if (item.Position != undefined) this.groupPosition = item.Position;
    if (item.Rank != undefined) this.rank = item.Rank;
    if (item['Placeholder teams'] != undefined) this.placeholderTeams = item['Placeholder teams'];
  }
}
