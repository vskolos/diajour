<script lang="ts">
  import clsx from 'clsx'
  import { format, getDay, parse } from 'date-fns'
  import ru from 'date-fns/locale/ru'
  import { GLUCOSE_LEVEL_TICKS, WEEK_DAYS } from '../../constants'
  import { weekStart } from '../../stores'
  import type { WeekData } from '../../types'
  import { generateWeekDates } from '../../utils'
  import DateGroup from './DateGroup.svelte'

  export let measurements: WeekData['measurements']

  let maxGlucoseLevel = measurements
    .map((measurement) => measurement.glucose)
    .reduce((prev, curr) => (curr > prev ? curr : prev))

  let ticks = GLUCOSE_LEVEL_TICKS.filter(
    (level) => maxGlucoseLevel > 30 || level > maxGlucoseLevel
  )
</script>

<div
  class="grid grid-cols-[auto,1fr] grid-rows-[1fr,auto] gap-2 h-[11.5625rem] w-full sm:h-[17.3125rem] md:h-[19.3125rem] p-4 border border-neutral-300 dark:border-neutral-600 rounded-lg transition-colors"
>
  <div class="flex flex-col items-end justify-between -my-2.5 sm:-my-3">
    {#each ticks as tick, index}
      <span
        class={clsx(
          'text-sm sm:text-base font-bold dark:text-white transition-colors',
          index % 2 === 1 && 'hidden sm:block'
        )}>{tick}</span
      >
    {/each}
  </div>
  <div
    class="relative isolate border-s border-neutral-300 dark:border-neutral-600 grid grid-cols-7 transition-colors"
  >
    {#each generateWeekDates($weekStart) as date}
      <DateGroup
        measurements={measurements.filter(
          (measurement) => measurement.date === date
        )}
        maxTickValue={ticks[0]}
      />
    {/each}

    <div
      class="absolute -z-10 inset-0 flex flex-col justify-between items-stretch"
    >
      {#each ticks as _, index}
        <span
          class={clsx(
            'h-px bg-neutral-300 dark:bg-neutral-600 transition-colors',
            index % 2 === 1 && 'hidden sm:block'
          )}
        ></span>
      {/each}
    </div>
  </div>
  <div />
  <div class="grid grid-cols-7">
    {#each generateWeekDates($weekStart) as date}
      <div class="grid items-center">
        <span
          class="text-sm md:text-base text-center font-bold dark:text-white transition-colors"
          >{WEEK_DAYS[getDay(parse(date, 'dd.MM.yyyy', new Date()))]}</span
        >
        <span
          class="text-2xs sm:text-xs font-normal md:text-sm text-center text-neutral-400"
          >{format(parse(date, 'dd.MM.yyyy', new Date()), 'd MMM', {
            locale: ru,
          }).replace('.', '')}</span
        >
      </div>
    {/each}
  </div>
</div>
