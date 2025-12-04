<template>
  <q-toolbar class="bg-blue">
    <q-toolbar-title> FIFA World Cup 2026 draw simulator </q-toolbar-title>
    <q-space />
    <q-tabs v-model="selectedTab" shrink stretch>
      <q-tab name="draw" label="Draw" />
      <q-tab name="procedure" label="Draw procedure" />
      <q-tab name="credits" label="Credits" />
    </q-tabs>
  </q-toolbar>
  <div class="q-pa-sm">
    <q-tab-panels v-model="selectedTab">
      <q-tab-panel name="draw">
        <p>Click the "Run draw" button to generate a result.</p>
        <div class="row">
          <q-btn color="green" label="Run draw" @click="runDraw" />
          <q-space />
          <q-toggle v-model="showDrawPots" label="Show draw pots" left-label />
        </div>
        <div v-if="showDrawPots">
          <div>
            <h5>Pots</h5>
            <q-space />
          </div>
          <div class="row items-center justify-evenly">
            <div v-for="x in [...new Set(teams.map((t) => t.pot))]" :key="x">
              <TeamStack :header="`Pot ${x}`" :teams="teams.filter((t) => t.pot == x)" />
            </div>
            <div>
              <h5>Key</h5>
              <ConfederationKey v-for="x in confederations" :key="x" :confederation="x" />
            </div>
          </div>
        </div>
        <h5>Groups</h5>
        <div class="row items-center justify-evenly q-gutter-y-sm">
          <team-stack
            v-for="x in groups"
            :key="groups.indexOf(x)"
            :header="`Group ${x.groupName}`"
            :teams="x.teams"
          />
        </div>
        <div v-if="drawOrder.length > 0">
          <h5>Draw order</h5>
          <q-markup-table>
            <thead>
              <tr>
                <th>Pot/Order</th>
                <th v-for="x in drawOrder.filter((d) => d.pot === 'Pot 1').length" :key="x">
                  #{{ x }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="y in [...new Set(teams.map((t) => t.pot))]" :key="y">
                <td>{{ `Pot ${y}` }}</td>
                <td
                  v-for="z in drawOrder.filter((d) => d.pot == `Pot ${y}`)"
                  :key="z.team"
                  :class="getGroupBackgroundColour(z.position[0])"
                >
                  <p>{{ z.team }}</p>
                  <p>{{ z.position }}</p>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
        <div v-if="groupValidators.length > 0">
          <h5>
            Group validation ({{ groupValidators.filter((v) => v.isValid()).length }}/{{
              groupValidators.length
            }}
            valid)
          </h5>
          <p>A group is valid if there are:</p>
          <ul>
            <li>Either 1 or 2 teams from UEFA</li>
            <li>A maximum of 1 team from any other confederation</li>
          </ul>
          <div class="row q-gutter-md">
            <div v-for="x in groupValidators" :key="x.group">
              <h5>{{ x.group }} ({{ x.isValid() ? 'Valid' : 'Invalid' }})</h5>
              <q-markup-table>
                <thead>
                  <tr>
                    <th>Confederation</th>
                    <th>Count</th>
                    <th>Is valid</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="y in x.results.entries()"
                    :key="y[0]"
                    :class="confederationValidator(y[0], y[1]) ? `bg-green` : `bg-red`"
                  >
                    <td>{{ y[0] }}</td>
                    <td>{{ y[1] }}</td>
                    <td>{{ confederationValidator(y[0], y[1]) }}</td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="procedure">
        <p>
          The procedure for the draw simulator is based on those published by FIFA. Details of the
          procedure can be found below:
        </p>
        <ul>
          <li>
            <a
              href="https://inside.fifa.com/organisation/media-releases/procedures-final-draw-world-cup-2026-revealed"
              >Inside FIFA article discussing the draw procedue</a
            >
          </li>
          <li>
            <a
              href="https://digitalhub.fifa.com/m/2d1a1ac7bab78995/original/Draw-Procedures-for-the-FIFA-World-Cup-2026.pdf"
            >
              Official PDF document with the procedure
            </a>
          </li>
        </ul>
        <h5>Pot composition</h5>
        <ul>
          <li>
            The 48 teams competing in the World Cup (42 known at the time of the draw) are divided
            into 4 draw pots, primarily based on the FIFA Men's World Rankings published in November
            2025.
            <ul>
              <li>
                Pot 1 contains the 3 host nations (Mexico, Canada and the United States) and the 9
                highest ranked known qualifiers.
              </li>
              <li>
                Pot 2 contains the next 12 highest ranked qualified teams, and pot 3 the next set of
                12 teams.
              </li>
              <li>
                Pot 4 has the remaining 6 known qualifiers, plus placeholders for the winners of
                FIFA's and UEFA's play-off tournament, which take place after the draw.
              </li>
            </ul>
          </li>
        </ul>
        <h5>Draw procedure</h5>
        <p>
          The 3 host nations (Mexico, Canada and the United States) have been assigned to enter
          groups A, B and D prior to the draw. The remaining teams will be randomly drawn to any
          eligable group.
        </p>
        <p>The following restrictions apply in the draw:</p>
        <ul>
          <li>
            Each group can generally have a maximum of one team from each continental confederation.
          </li>
          <ul>
            <li>
              As there will be more UEFA teams in the tournament than groups (16 vs. 12), each group
              will have either 1 or 2 UEFA teams.
            </li>
            <li>
              Placeholders for the winners of the FIFA inter-continental play-offs can only go into
              a group without a team from the confederations of the teams for each respective
              play-off pathway.
              <ul>
                <li>
                  Pathway 1 has teams from CAF, Concacaf and the OFC, and can only enter a group
                  with teams from the AFC, CONMEBOL and UEFA.
                </li>
                <li>
                  Pathway 2 has teams from the AFC, Concacaf and CONMEBOL, and can only enter a
                  group with teams from CAF, the OFC and UEFA.
                </li>
              </ul>
            </li>
          </ul>
          <li>
            The four highest ranked teams prior to the draw (Spain, Argentina, France and England),
            will be drawn into groups that ensure these teams would only play each other from the
            semi-final stage if they win their respective group. In addition, each team has been
            paired with another based on ranking (Spain with Argentina, and France with England),
            and the teams in each pair will only play each other in the final or third-place
            play-off if they both win their group.
          </li>
        </ul>

        <p>
          Teams in pot 1 will be allocated to positon 1 of the group they are drawn to. Teams in
          pots 2, 3 and 4 will be allocated to a specific group and position depending on their pot
          and the group they are drawn to.
        </p>
      </q-tab-panel>
      <q-tab-panel name="credits">
        <p>
          I used a number of free technologies and sources to help build this project. I would like
          to show my appreciation by listing them below.
        </p>
        <ul>
          <li>
            This application was written with the Vue framework (<a href="https://vuejs.org/"
              >https://vuejs.org/</a
            >).
          </li>
          <li>
            The Quasar framework is used for the components and styling (<a
              href="https://quasar.dev/"
              >https://quasar.dev/</a
            >).
          </li>
          <li>
            Team flags are sourced from Flagpedia (<a href="https://flagpedia.net/"
              >https://flagpedia.net/</a
            >).
          </li>
          <li>
            The logos for FIFA and UEFA are sourced from Wikimedia Commons(<a
              href="https://commons.wikimedia.org/wiki/Main_Page"
              >https://commons.wikimedia.org/wiki/Main_Page/</a
            >).
          </li>
        </ul>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import json from '../json/World Cup 2026 teams.json';

import Team from 'src/classes/team';
import Group from 'src/classes/group';

import confederationValidator from 'src/classes/confederationValidator';

import TeamStack from 'src/components/TeamStack.vue';
import { Confederation } from 'src/enums/confederation';
import TeamGroupContainer from 'src/classes/teamGroupContainer';
import DrawResult from 'src/classes/drawResult';
import GroupValidatorResult from 'src/classes/groupValidatorResult';
import ConfederationKey from 'src/components/ConfederationKey.vue';

// Stores all teams in the tournament
const teams = ref<Team[]>([]);

// Stores groups in the tournament
const groups = ref<Group[]>([]);

// Stores the order the teams were drawn to
const drawOrder = ref<DrawResult[]>([]);

// Stores test results of the draw
const groupValidators = ref<GroupValidatorResult[]>([]);

// Stores the name of the tab currently visible
const selectedTab = ref<string>('draw');

// If true, shows the draw pots in the draw tab
const showDrawPots = ref<boolean>(true);

// Stores an array of team confederations
const confederations = [
  Confederation.AFC,
  Confederation.CAF,
  Confederation.Concacaf,
  Confederation.CONMEBOL,
  Confederation.OFC,
  Confederation.UEFA,
];

onBeforeMount(() => {
  // Converts each JSON value into a team object
  json.forEach((j) => {
    const team = new Team(j.Team);
    team.populateValues(j);
    teams.value.push(team);
  });
  initialiseGroups();
});

// Creates groups with 12 blank placeholder values
function initialiseGroups() {
  groups.value = [];
  drawOrder.value = [];
  groupValidators.value = [];
  for (let i = 0; i < 12; i++) {
    groups.value?.push(new Group(String.fromCharCode(65 + i)));
  }
}

// Runs the draw
function runDraw() {
  initialiseGroups();
  teams.value.forEach((t) => (t.isDrawn = false));

  // Gets the pots in the draw
  const pots = [...new Set(teams.value.map((t) => t.pot))];
  for (let i = 0; i < 4; i++) {
    // Gets all teams in the selected pot
    let potTeams = teams.value.filter((t) => t.pot === pots[i]);

    // Assigns teams with pre-determined groups
    const preAssignedTeams = potTeams.filter((t) => t.group != null);
    preAssignedTeams.forEach((t) => {
      const selectedGroup = groups.value.find((g) => g.groupName === t.group);
      assignTeamToGroup(t, selectedGroup);
    });
    // Removes teams pre-assigned to a groups
    potTeams = potTeams.filter((t) => !preAssignedTeams.includes(t));
    while (potTeams.length > 0) {
      //Randomises array contents if there are 2 or more teams
      if (potTeams.length > 1) shuffleArray(potTeams);
      //Gets and remove the first team in the array
      const selectedTeam = potTeams.shift();
      console.log(`Selected ${selectedTeam?.name}`);
      // Get groups with no teams from pot
      const eligibleGroups = groups.value.filter((g) => g.teams.every((t) => t.pot != pots[i]));

      // If team can go into group, assingn to selected group
      for (let j = 0; j < eligibleGroups.length; j++) {
        if (
          getTeamsThatCanEnterGroup(eligibleGroups[j], pots[i]).includes(selectedTeam) ||
          j === eligibleGroups.length - 1
        ) {
          assignTeamToGroup(selectedTeam, eligibleGroups[j]);

          break;
        } else {
          console.log(`Skipping Group ${eligibleGroups[j]?.groupName}`);
        }
      }
    }
  }

  // Adds validation results for each group
  groups.value.forEach((g) => {
    // Map to store each confederation and the number of members in the group
    const map: Map<string, number> = new Map();
    confederations.forEach((c) => {
      map.set(c, g.teams.filter((t) => t.confederation.includes(c)).length);
    });

    groupValidators.value.push(new GroupValidatorResult(`Group ${g.groupName}`, map));
  });
}

// Adds a team to a group
function assignTeamToGroup(team: Team, group: Group) {
  //Determines postistion team is assigned to based on draw pot and group
  let indexToBeAssignedTo = 0;
  switch (group.groupName) {
    case 'A':
    case 'D':
    case 'G':
    case 'J':
      if (team.pot == 2) indexToBeAssignedTo = 2;
      if (team.pot == 3) indexToBeAssignedTo = 1;
      if (team.pot == 4) indexToBeAssignedTo = 3;
      break;
    case 'B':
    case 'E':
    case 'H':
    case 'K':
      if (team.pot == 2) indexToBeAssignedTo = 3;
      if (team.pot == 3) indexToBeAssignedTo = 2;
      if (team.pot == 4) indexToBeAssignedTo = 1;
      break;
    case 'C':
    case 'F':
    case 'I':
    case 'L':
      if (team.pot == 2) indexToBeAssignedTo = 1;
      if (team.pot == 3) indexToBeAssignedTo = 3;
      if (team.pot == 4) indexToBeAssignedTo = 2;
  }

  group.teams[indexToBeAssignedTo] = team;
  console.log(`Assigned ${team.name} to Group ${group.groupName}`);
  drawOrder.value.push(
    new DrawResult(team.name, `Pot ${team.pot}`, `${group.groupName}${indexToBeAssignedTo + 1}`),
  );
  team.isDrawn = true;
}

// Returns a list of teams that can enter a group
function getTeamsThatCanEnterGroup(group: Group, pot: number): Team[] {
  // Part 1: selects teams not drawn and in the same draw pot
  let eligibleTeams = teams.value.filter((t) => !t.isDrawn && t.pot == pot);
  // Part 2: if group has 3 teams, none from UEFA, return UEFA teams only
  if (
    group.numberOfTeams() === 3 &&
    group.teams.filter((t) => t.confederation.includes(Confederation.UEFA)).length === 0
  )
    return eligibleTeams.filter((t) => t.confederation.includes(Confederation.UEFA));

  // restrictions based on IC play-off teams

  if (teams.value.filter((t) => t.name === 'FIFA IC Pathway 1 Winners' && !t.isDrawn).length != 0) {
    const ic1Confederations = teams.value
      .filter((t) => t.name === 'FIFA IC Pathway 1 Winners')
      .map((t) => t.confederation)
      .flat();
    const ic1Groups = groups.value.filter(
      (g) =>
        g.teams
          .map((t) => t.confederation)
          .flat()
          .every((c) => !ic1Confederations.includes(c)) && g.numberOfTeams() != 4,
    );

    console.log(`Number of groups IC1 winners can enter: ${ic1Groups.length}`);
    console.log(ic1Groups.map((g) => g.groupName));

    if (ic1Groups.length === 1 && ic1Groups.includes(group)) {
      if (pot == 4) {
        return eligibleTeams.filter((t) => t.name === 'FIFA IC Pathway 1 Winners');
      } else {
        eligibleTeams = eligibleTeams.filter((t) =>
          t.confederation.every((c) => !ic1Confederations.includes(c)),
        );
      }
    }
  }

  // Section for IC pathway 2 teams
  if (teams.value.filter((t) => t.name === 'FIFA IC Pathway 2 Winners' && !t.isDrawn).length != 0) {
    const ic2Confederations = teams.value
      .filter((t) => t.name === 'FIFA IC Pathway 2 Winners')
      .map((t) => t.confederation)
      .flat();
    const ic2Groups = groups.value.filter(
      (g) =>
        g.teams
          .map((t) => t.confederation)
          .flat()
          .every((c) => !ic2Confederations.includes(c)) && g.numberOfTeams() != 4,
    );

    console.log(`Number of groups IC2 winners can enter: ${ic2Groups.length}`);
    console.log(ic2Groups.map((g) => g.groupName));

    if (ic2Groups.length === 1 && ic2Groups.includes(group)) {
      if (pot == 4) {
        return eligibleTeams.filter((t) => t.name === 'FIFA IC Pathway 2 Winners');
      } else {
        eligibleTeams = eligibleTeams.filter((t) =>
          t.confederation.every((c) => !ic2Confederations.includes(c)),
        );
      }
    }
  }

  // Part 3: removes teams based on confederation restrictions
  confederations.forEach((c) => {
    // Section for UEFA teams
    if (c === Confederation.UEFA) {
      // Removes teams if group has 2 UEFA teams, or group has 1 team and there are as many teams
      // without a UEFA team as there are teams remaining
      const numberOfUEFATeams = group.teams.filter((t) => t.confederation.includes(c)).length;
      const groupsWith2UEFATeams = groups.value.filter(
        (g) =>
          g.teams
            .map((t) => t.confederation)
            .flat()
            .filter((x) => x === Confederation.UEFA).length === 2,
      ).length;
      if (numberOfUEFATeams > 1 || (numberOfUEFATeams > 0 && groupsWith2UEFATeams === 4)) {
        eligibleTeams = eligibleTeams.filter((t) => !t.confederation.includes(c));
      }
    }
    // Remove teams if one from the same non-UEFA confederation is in the group
    else {
      if (group.teams.filter((t) => t.confederation.includes(c)).length > 0)
        eligibleTeams = eligibleTeams.filter((t) => !t.confederation.includes(c));
    }
  });

  // Part 4: removes teams if addding them to the group will violate the draw
  // requrements by forcing other teams into incompatible groups

  // Gets confederation values for all teams yet to be drawn
  const confederationsToBeDrawn = [
    ...new Set(
      teams.value
        .filter((t) => !t.isDrawn)
        .map((t) => t.confederation)
        .flat(),
    ),
  ];

  // Container to store all teams yet to be drawn and the groups they can be drawn to
  const teamGroupPairs: TeamGroupContainer[] = [];
  confederationsToBeDrawn.forEach((c) => {
    const pair = new TeamGroupContainer();
    // Gets teams that are not drawn and are of the selected confederation(s)
    pair.teams = teams.value.filter((t) => !t.isDrawn && t.confederation.includes(c));
    // Adds group to container if teams from the confederation can be added
    groups.value.forEach((g) => {
      // Maps pot numbers for group and teams
      const groupMap = g.teams.map((t) => t.pot);
      const teamMap = eligibleTeams.map((t) => t.pot);

      // Enters section if there are no teams in the current pot already drawn to a group
      if (group.numberOfTeams() < 4) {
        // Section for UEFA teams
        if (c === Confederation.UEFA) {
          // If there are no teams from UEFA, add group
          if (group.getConfederationTeams(c) === 0) pair.eligibleGroups.push(g);

          // Adds group if there is 1 UEFA team and there are less than 4 groups with 2 UEFA teams
          if (
            group.getConfederationTeams(c) === 1 &&
            groups.value.filter(
              (x) => x.teams.filter((t) => t.confederation.includes(Confederation.UEFA)).length < 4,
            )
          )
            pair.eligibleGroups.push(g);
        }
        // Section for non-UEFA teams
        else {
          // Adds group if none of the teams in the group have the same confederation values
          if (
            g.teams.every(
              (t) =>
                !t.confederation.includes(c) && t.pot <= Math.max(...pair.teams.map((x) => x.pot)),
            )
          )
            pair.eligibleGroups.push(g);
        }
      }
    });

    teamGroupPairs.push(pair);
  });

  teamGroupPairs.forEach((tg) => {
    // Checks if the length of each confederation group and avilable teams are the same length
    if (tg.teams.length === tg.eligibleGroups.length) {
      // Reduces teams to those in pairing if group is in the pair
      if (tg.eligibleGroups.includes(group))
        eligibleTeams = eligibleTeams.filter((t) => tg.teams.includes(t));
    }
  });

  // Part 6: removes teams based on priciple that top 4 teams would ideally meet
  // from the semi-finals
  // The names of groups to be added based of semi-final pairings
  const semiFinalGroupLetters = [
    ['E', 'F', 'I'],
    ['D', 'G', 'H'],
    ['A', 'C', 'L'],
    ['B', 'J', 'K'],
  ];

  // Gets the first semi-final pairing (Spain and Argentina)
  const pairing1 = teams.value.filter((t) => t.rank == 1 || t.rank == 2);

  // Gets the second semi-final pairing (France and England)
  const pairing2 = teams.value.filter((t) => t.rank == 3 || t.rank == 4);

  const semiFinalGroupPairs: Group[][] = [];

  // Fetches each group
  semiFinalGroupLetters.forEach((p) => {
    semiFinalGroupPairs.push(groups.value.filter((g) => p.includes(g.groupName)));
  });

  const selectedPair = semiFinalGroupPairs.find((x) => x.includes(group));
  // First check: if none of these groups have the paired teams and there's one free group
  // filter teams to those in the pairs

  const numberOfGroupsWithPairedTeams = selectedPair?.filter(
    (p) => p.teams.filter((t) => pairing1.includes(t) || pairing2.includes(t)).length,
  ).length;
  const numberOfTeamsDrawnIntoGroup = selectedPair?.filter((p) => p.numberOfTeams() > 0).length;

  if (numberOfGroupsWithPairedTeams === 0 && numberOfTeamsDrawnIntoGroup === 2) {
    const value = selectedPair.filter((p) => p.teams.map((t) => t.pot).includes(1));
    eligibleTeams = eligibleTeams.filter((t) => pairing1.includes(t) || pairing2.includes(t));
  }

  // Second check: remove all paired teams if any are in adjacent groups
  if (
    !selectedPair
      ?.map((p) => p.teams)
      .flat()
      .every((t) => !pairing1.includes(t) && !pairing2.includes(t))
  )
    eligibleTeams = eligibleTeams.filter((t) => !pairing1.includes(t) && !pairing2.includes(t));

  // Final check: remove paired teams if they would meet before the semi-finals or final
  const selectedIndex = semiFinalGroupPairs.indexOf(selectedPair);

  // Stores neigbouring pair of teams
  const adjacentPair =
    selectedIndex % 2 === 0
      ? semiFinalGroupPairs[selectedIndex + 1]
      : semiFinalGroupPairs[selectedIndex - 1];
  // If a paired team is in adjacent pair of groups, remove the other team from this group
  if (adjacentPair?.filter((p) => pairing1.every((x) => p.teams.includes(x))).length != 0)
    eligibleTeams = eligibleTeams.filter((t) => !pairing1.includes(t));
  if (adjacentPair?.filter((p) => pairing2.every((x) => p.teams.includes(x))).length != 0)
    eligibleTeams = eligibleTeams.filter((t) => !pairing2.includes(t));

  return eligibleTeams;
}

// Randomises the contents of an array; based on the Fisher-Yates algorithm
function shuffleArray(array: Array<unknown>) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function getGroupBackgroundColour(letter: string): string {
  switch (letter) {
    case 'A':
      return 'bg-green-4';
    case 'B':
      return 'bg-red-4';
    case 'C':
      return 'bg-yellow-4';
    case 'D':
      return 'bg-blue-4';
    case 'E':
      return 'bg-purple-4';
    case 'F':
      return 'bg-orange-4';
    case 'G':
      return 'bg-cyan-4';
    case 'H':
      return 'bg-brown-4';
    case 'I':
      return 'bg-teal-4';
    case 'J':
      return 'bg-pink-4';
    case 'K':
      return 'bg-blue-grey-4';
    case 'L':
      return 'bg-indigo-4';
    default:
      return '';
  }
}
</script>
