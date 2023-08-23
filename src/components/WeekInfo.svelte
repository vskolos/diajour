<script lang="ts">
  import clsx from 'clsx'
  import { addDays, format, isSameWeek, subWeeks } from 'date-fns'
  import ru from 'date-fns/locale/ru'
  import { trpc } from '../main'
  import { weekStart } from '../stores'
  import DataBadge from './DataBadge.svelte'

  const now = new Date()

  $: week = trpc.week.get.query({
    date: format($weekStart, 'yyyy-MM-dd'),
  })

  const updateWeek = trpc.week.update.mutation({
    onSuccess: () =>
      trpc.entry.list.utils.invalidate({
        weekStart: format($weekStart, 'yyyy-MM-dd'),
      }),
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
  {#if $week.data}
    <div class="flex items-center gap-2">
      <DataBadge
        label="дозировка"
        value={$week.data.dosage ? `${$week.data.dosage}` : ''}
        unit="ед"
        on:submit={(event) =>
          $updateWeek.mutate({
            start: format($weekStart, 'yyyy-MM-dd'),
            dosage: event.detail.value,
          })}
      />
      <DataBadge
        label="вес"
        value={$week.data.weight ? `${$week.data.weight}` : ''}
        unit="кг"
        on:submit={(event) =>
          $updateWeek.mutate({
            start: format($weekStart, 'yyyy-MM-dd'),
            weight: event.detail.value,
          })}
      />
    </div>
  {/if}
</div>
