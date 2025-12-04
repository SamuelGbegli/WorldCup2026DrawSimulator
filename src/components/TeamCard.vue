<template>
  <q-item :class="determineCardColour()">
    <q-item-section avatar>
      <q-img
        v-if="!!imgSrc"
        :src="imgSrc"
        spinner-size="24px"
        fit="contain"
        style="width: 40px; max-height: 32px"
      />
    </q-item-section>
    <q-item-section>
      <div class="row q-gutter-x-sm">
        {{ description }} {{ !!rank ? `(${rank})` : '' }}
        <q-space />
        <q-icon
          v-if="placeholders != undefined && placeholders?.length > 0"
          name="info_outline"
          size="xs"
        >
          <q-tooltip class="text-body2">
            {{ placeholders?.toString().replaceAll(',', ', ') }}
          </q-tooltip>
        </q-icon>
      </div>
    </q-item-section>
  </q-item>
</template>
<script setup lang="ts">
import { Confederation } from 'src/enums/confederation';

const props = defineProps<{
  imgSrc?: string | null;
  description?: string | null;
  rank?: string | null;
  confederation?: string | null;
  placeholders?: string[] | null;
}>();

function determineCardColour() {
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
