<script lang="ts">
  import clsx from 'clsx'
  import type { WeekData } from '../../types'

  export let measurement: WeekData['measurements'][number]
</script>

{#if measurement}
  <td
    class="grid py-2 sm:py-4 items-center border-e border-e-neutral-300 dark:border-e-neutral-600 transition-colors last:border-e-0"
  >
    <span
      class={clsx(
        'text-lg text-center font-bold sm:text-2xl md:text-3xl transition-colors',
        measurement.glucose < 2
          ? 'text-red-500 dark:text-red-600'
          : measurement.glucose < 6
          ? 'text-orange-500 dark:text-orange-600'
          : measurement.glucose < 18
          ? 'text-green-500 dark:text-green-600'
          : measurement.glucose < 28
          ? 'text-sky-500 dark:text-sky-600'
          : 'text-purple-500 dark:text-purple-600'
      )}>{measurement.glucose}</span
    >
  </td>
{:else}
  <td
    class="grid py-2 sm:py-4 items-center border-e border-e-neutral-300 dark:border-e-neutral-600 transition-colors last:border-e-0"
  >
    <span
      class="text-lg text-center font-bold sm:text-2xl md:text-3xl text-neutral-400"
      >–</span
    >
  </td>
{/if}
