<script lang="ts">
  import {
    addDays,
    addWeeks,
    format,
    isSameWeek,
    startOfWeek,
    subWeeks,
  } from 'date-fns'
  import ru from 'date-fns/locale/ru'
  import ChevronLeftIcon from '../icons/ChevronLeftIcon.svelte'
  import ChevronRightIcon from '../icons/ChevronRightIcon.svelte'
  import { weekStart } from '../stores'

  const now = new Date()

  function addWeek() {
    weekStart.update((weekStart) => addWeeks(weekStart, 1))
  }

  function subWeek() {
    weekStart.update((weekStart) => subWeeks(weekStart, 1))
  }
</script>

<div
  class="bg-white md:grid md:grid-cols-3 lg:grid-cols-1 rounded-2xl p-3 flex flex-wrap gap-2 items-center shadow-card dark:bg-neutral-800 dark:shadow-card-dark transition-colors"
>
  <button
    class="text-center px-3 py-2 flex-grow rounded-lg hover:bg-neutral-300 focus-visible:bg-neutral-300 active:bg-neutral-600 disabled:bg-neutral-600 disabled:text-white transition-colors active:text-white dark:text-white dark:hover:bg-neutral-600 dark:focus-visible:bg-neutral-600 dark:active:bg-neutral-300 dark:disabled:bg-neutral-300 dark:active:text-black dark:disabled:text-black"
    disabled={isSameWeek(now, $weekStart, { weekStartsOn: 1 })}
    on:click={() => weekStart.set(startOfWeek(now, { weekStartsOn: 1 }))}
    >Текущая <span class="hidden sm:inline">неделя</span></button
  >
  <button
    class="text-center px-3 py-2 flex-grow rounded-lg hover:bg-neutral-300 focus-visible:bg-neutral-300 active:bg-neutral-600 disabled:bg-neutral-600 disabled:text-white transition-colors active:text-white dark:text-white dark:hover:bg-neutral-600 dark:focus-visible:bg-neutral-600 dark:active:bg-neutral-300 dark:disabled:bg-neutral-300 dark:active:text-black dark:disabled:text-black"
    disabled={isSameWeek(subWeeks(now, 1), $weekStart, { weekStartsOn: 1 })}
    on:click={() =>
      weekStart.set(startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }))}
    >Предыдущая <span class="hidden sm:inline">неделя</span></button
  >
  <div class="flex items-center gap-2 flex-grow">
    <button
      class="p-1.5 border-[1.5px] border-neutral-300 rounded-lg hover:bg-neutral-200 focus-visible:bg-neutral-200 active:bg-neutral-300 dark:border-neutral-600 dark:hover:bg-neutral-700 dark:focus-visible:bg-neutral-700 dark:active:bg-neutral-600 transition-[color,background-color,border-color,text-decoration-color,fill,stroke,opacity] disabled:pointer-events-none disabled:opacity-50"
      aria-label="Профиль"
      on:click={subWeek}
    >
      <ChevronLeftIcon class="dark:text-white transition-colors" />
    </button>
    <span
      class="sm:hidden xl:block dark:text-white transition-colors flex-grow text-center"
      >{format($weekStart, 'd MMMM', { locale: ru })} – {format(
        addDays($weekStart, 6),
        'd MMMM',
        { locale: ru }
      )}</span
    >
    <span
      class="hidden sm:block xl:hidden dark:text-white transition-colors flex-grow text-center"
      >{format($weekStart, 'dd.MM', { locale: ru })} – {format(
        addDays($weekStart, 6),
        'dd.MM',
        { locale: ru }
      )}</span
    >
    <button
      class="p-1.5 border-[1.5px] border-neutral-300 rounded-lg hover:bg-neutral-200 focus-visible:bg-neutral-200 active:bg-neutral-300 dark:border-neutral-600 dark:hover:bg-neutral-700 dark:focus-visible:bg-neutral-700 transition-[color,background-color,border-color,text-decoration-color,fill,stroke,opacity] dark:active:bg-neutral-600 disabled:pointer-events-none disabled:opacity-50"
      aria-label="Профиль"
      disabled={isSameWeek(now, $weekStart, { weekStartsOn: 1 })}
      on:click={addWeek}
    >
      <ChevronRightIcon class="dark:text-white transition-colors" />
    </button>
  </div>
</div>
