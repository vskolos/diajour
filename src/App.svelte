<script lang="ts">
  import { addDays, format, isSameWeek, subWeeks } from 'date-fns'
  import ru from 'date-fns/locale/ru'
  import Header from './components/Header.svelte'
  import WeekPicker from './components/WeekPicker.svelte'
  import Chart from './features/Chart/Chart.svelte'
  import Table from './features/Table/Table.svelte'
  import ChartIcon from './icons/ChartIcon.svelte'
  import PlusIcon from './icons/PlusIcon.svelte'
  import TableIcon from './icons/TableIcon.svelte'
  import { weekStart } from './stores'
  import { weekData } from './temp/data'

  const now = new Date()

  let mode: 'table' | 'chart' = 'table'
</script>

<Header />

<main class="grid gap-4 sm:gap-5 py-4 sm:py-5 lg:grid-cols-4 lg:items-start">
  <aside class="grid gap-4 sm:gap-5">
    <WeekPicker />
    <button
      class="flex items-center justify-center rounded-xl gap-1 p-4 bg-neutral-600 absolute end-4 bottom-4 sm:end-5 sm:bottom-5 lg:static hover:bg-neutral-700 focus-visible:bg-neutral-700 active:bg-neutral-800 transition-colors dark:bg-neutral-300 dark:hover:bg-neutral-200 dark:focus-visible:bg-neutral-200 dark:active:bg-neutral-100 shadow-[0px_0px_4px_0px] shadow-neutral-600 dark:shadow-neutral-300"
    >
      <PlusIcon class="text-white dark:text-black transition-colors" />
      <span
        class="hidden lg:block text-lg text-white dark:text-black transition-colors"
        >Добавить замер</span
      >
    </button>
  </aside>

  <div
    class="bg-white rounded-2xl lg:col-span-3 p-4 sm:p-6 grid gap-4 shadow-card dark:bg-neutral-800 dark:shadow-card-dark transition-colors"
  >
    <div class="flex gap-2 items-center">
      <div class="flex gap-y-1 gap-x-2 flex-wrap items-center me-auto">
        <h2
          class="text-xl md:text-2xl font-bold dark:text-white transition-colors"
        >
          {isSameWeek(now, $weekStart, { weekStartsOn: 1 })
            ? 'Текущая неделя'
            : isSameWeek(subWeeks(now, 1), $weekStart, { weekStartsOn: 1 })
            ? 'Предыдущая неделя'
            : `${format($weekStart, 'd MMMM', { locale: ru })} – ${format(
                addDays($weekStart, 6),
                'd MMMM',
                { locale: ru }
              )}`}
        </h2>
        <div class="flex items-center gap-2">
          {#if weekData.dosage !== null}
            <span
              class="py-1 text-xs px-2 text-center rounded-md bg-neutral-100 transition-colors dark:bg-neutral-900 dark:text-white"
              >{weekData.dosage} ед</span
            >
          {/if}
          {#if weekData.weight !== null}
            <span
              class="py-1 text-xs px-2 text-center rounded-md bg-neutral-100 transition-colors dark:bg-neutral-900 dark:text-white"
              >{weekData.weight} кг</span
            >
          {/if}
        </div>
      </div>
      <button
        class="p-2 rounded-lg hover:bg-neutral-300 focus-visible:bg-neutral-300 active:bg-neutral-600 disabled:bg-neutral-600 transition-colors dark:hover:bg-neutral-600 dark:focus-visible:bg-neutral-600 dark:active:bg-neutral-300 dark:disabled:bg-neutral-300 group"
        disabled={mode === 'table'}
        on:click={() => {
          mode = 'table'
        }}
      >
        <TableIcon
          class="dark:text-white transition-colors group-disabled:text-white group-active:text-white dark:group-active:text-black dark:group-disabled:text-black"
        /></button
      >
      <button
        class="p-2 rounded-lg hover:bg-neutral-300 focus-visible:bg-neutral-300 active:bg-neutral-600 disabled:bg-neutral-600 transition-colors dark:hover:bg-neutral-600 dark:focus-visible:bg-neutral-600 dark:active:bg-neutral-300 dark:disabled:bg-neutral-300 group"
        disabled={mode === 'chart'}
        on:click={() => {
          mode = 'chart'
        }}
        ><ChartIcon
          class="dark:text-white transition-colors group-disabled:text-white group-active:text-white dark:group-active:text-black dark:group-disabled:text-black"
        /></button
      >
    </div>

    {#if mode === 'table'}
      <Table measurements={weekData.measurements} />
    {:else if mode === 'chart'}
      <Chart measurements={weekData.measurements} />
    {/if}
  </div>
</main>
