<script lang="ts">
  import { format, parse } from 'date-fns'
  import { TIME_PERIODS } from '../../constants'
  import { trpc } from '../../main'
  import { weekStart } from '../../stores'
  import { generateWeekDates } from '../../utils'
  import Cell from './Cell.svelte'
  import DateCell from './DateCell.svelte'

  $: entryList = trpc.entry.list.query({
    weekStart: format($weekStart, 'yyyy-MM-dd'),
  })
</script>

<table
  class="grid rounded-lg border border-neutral-300 dark:border-neutral-600 transition-colors"
>
  <thead class="grid">
    <tr
      class="grid grid-cols-8 border-b border-b-neutral-300 dark:border-b-neutral-600 transition-colors"
    >
      <th
        class="grid py-2 sm:py-4 items-center border-e border-e-neutral-300 dark:border-e-neutral-600 transition-colors last:border-e-0"
      >
        <span
          class="hidden sm:block text-sm md:text-base text-center font-bold dark:text-white transition-colors"
          >Глюкоза</span
        >
        <span
          class="hidden font-normal sm:block text-xs md:text-sm text-center text-neutral-400"
          >ммоль/л</span
        >
      </th>
      {#each generateWeekDates($weekStart) as date}
        <DateCell date={parse(date, 'yyyy-MM-dd', new Date())} />
      {/each}
    </tr>
  </thead>
  <tbody class="grid">
    {#each TIME_PERIODS as period}
      <tr
        class="grid grid-cols-8 border-b border-b-neutral-300 dark:border-b-neutral-600 transition-colors last:border-b-0"
      >
        {#if period === 'morning'}
          <th
            class="grid py-2 sm:py-4 items-center border-e border-e-neutral-300 dark:border-e-neutral-600 transition-colors last:border-e-0"
          >
            <span
              class="text-xs sm:text-sm md:text-base text-center font-bold dark:text-white transition-colors"
              >Утро</span
            >
            <span
              class="hidden font-normal sm:block text-xs md:text-sm text-center text-neutral-400"
              >до 12:00</span
            >
          </th>
        {:else if period === 'midday'}
          <th
            class="grid py-2 sm:py-4 items-center border-e border-e-neutral-300 dark:border-e-neutral-600 transition-colors last:border-e-0"
          >
            <span
              class="text-xs sm:text-sm md:text-base text-center font-bold dark:text-white transition-colors"
              >День</span
            >
            <span
              class="hidden font-normal sm:block text-xs md:text-sm text-center text-neutral-400"
              >до 18:00</span
            >
          </th>
        {:else if period === 'evening'}
          <th
            class="grid py-2 sm:py-4 items-center border-e border-e-neutral-300 dark:border-e-neutral-600 transition-colors last:border-e-0"
          >
            <span
              class="text-xs sm:text-sm md:text-base text-center font-bold dark:text-white transition-colors"
              >Вечер</span
            >
            <span
              class="hidden font-normal sm:block text-xs md:text-sm text-center text-neutral-400"
              >с 18:00</span
            >
          </th>
        {/if}
        {#each generateWeekDates($weekStart) as date}
          <Cell
            entry={$entryList.data?.find(
              (entry) => entry.date === date && entry.timePeriod === period
            )}
          />
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
