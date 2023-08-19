<script lang="ts">
  import clsx from 'clsx'
  import { addDays, format, isSameWeek, subWeeks } from 'date-fns'
  import ru from 'date-fns/locale/ru'
  import { trpc } from '../main'
  import { weekStart } from '../stores'

  const now = new Date()

  $: week = trpc.entries.list.query({
    weekStart: format($weekStart, 'yyyy-MM-dd'),
  })

  let className = ''
  export { className as class }
</script>

<div class={clsx('flex gap-y-1 gap-x-2 flex-wrap items-center', className)}>
  <h2 class="text-xl md:text-2xl font-bold dark:text-white transition-colors">
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
    {#if $week.data && $week.data.dosage !== null}
      <span
        class="py-1 text-xs px-2 text-center rounded-md bg-neutral-100 transition-colors dark:bg-neutral-900 dark:text-white"
        >{$week.data.dosage} ед</span
      >
    {/if}
    {#if $week.data && $week.data.weight !== null}
      <span
        class="py-1 text-xs px-2 text-center rounded-md bg-neutral-100 transition-colors dark:bg-neutral-900 dark:text-white"
        >{$week.data.weight} кг</span
      >
    {/if}
  </div>
</div>
