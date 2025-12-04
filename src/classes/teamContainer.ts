// Represents a draw pot or group.

import type Team from './team';

export default class TeamContainer {
  // The name of the pot/group.
  name: string = '';
  // The teams in the pot/group.
  teams: Team[] = [];

  constructor(name: string) {
    this.name = name;
  }
}
