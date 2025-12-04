<template>
  <q-list bordered separator padding style="width: 310px">
    <q-item-label header>{{ header }}</q-item-label>
    <TeamCard
      v-for="x in teams"
      :key="teams.indexOf(x)"
      :rank="x.rank"
      :description="x.name"
      :img-src="x.flag"
      :confederation="x.confederation.length == 1 ? x.confederation[0] : null"
      :placeholders="x.placeholderTeams"
    />
  </q-list>
</template>

<script setup lang="ts">
import type Team from 'src/classes/team';
import TeamCard from './TeamCard.vue';

defineProps<{
  header: string;
  teams: Team[];
}>();
</script>
