import type Group from './group';
import type Team from './team';

// Stores a combination of teams and groups each team can enter.
export default class TeamGroupContainer {
  teams: Team[] = [];
  eligibleGroups: Group[] = [];
}
