<template>
  <q-item>
    <q-item-section avatar>
      <div :class="determineColour()" style="width: 30px; height: 30px" />
    </q-item-section>
    <q-item-section>
      {{ confederation }}
    </q-item-section>
  </q-item>
</template>
<script setup lang="ts">
import { Confederation } from 'src/enums/confederation';

const props = defineProps<{
  confederation: string;
}>();

function determineColour() {
  if (props.confederation == null) return '';
  switch (props.confederation) {
    case Confederation.AFC:
      return 'bg-orange-3';
    case Confederation.CAF:
      return 'bg-yellow-3';
    case Confederation.Concacaf:
      return 'bg-blue-3';
    case Confederation.CONMEBOL:
      return 'bg-green-3';
    case Confederation.OFC:
      return 'bg-grey-3';
    case Confederation.UEFA:
      return 'bg-red-3';
    default:
      return '';
  }
}
</script>
