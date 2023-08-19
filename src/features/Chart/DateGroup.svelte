<script lang="ts">
  import clsx from 'clsx'
  import type { WeekData } from '../../types'

  export let entries: WeekData['entries']
  export let maxTickValue: number

  $: if (entries.length === 0)
    entries.push({ date: '', period: 'midday', glucose: 0 })
</script>

<div
  class="grid border-e border-neutral-300 dark:border-neutral-600 transition-colors"
  style={`grid-template-columns: repeat(${entries.length}, minmax(0, 1fr));`}
>
  {#each entries as entry}
    <div class="relative flex justify-center">
      <button
        class={clsx(
          'absolute translate-y-1/2 rounded-full w-2 h-2 md:w-3 md:h-3 shadow-[0px_0px_2px_0px] md:shadow-[0px_0px_3px_0px] transition-colors',
          entry.glucose === 0
            ? 'bg-neutral-400 !shadow-neutral-400'
            : entry.glucose < 2
            ? 'bg-red-500 !shadow-red-500 dark:bg-red-600 dark:!shadow-red-600'
            : entry.glucose < 6
            ? 'bg-orange-500 !shadow-orange-500 dark:bg-orange-600 dark:!shadow-orange-600'
            : entry.glucose < 18
            ? 'bg-green-500 !shadow-green-500 dark:bg-green-600 dark:!shadow-green-600'
            : entry.glucose < 28
            ? 'bg-sky-500 !shadow-sky-500 dark:bg-sky-600 dark:!shadow-sky-600'
            : 'bg-purple-500 !shadow-purple-500 dark:bg-purple-600 dark:!shadow-purple-600'
        )}
        style={`bottom: ${(entry.glucose / maxTickValue) * 100}%`}
      />
    </div>
  {/each}
</div>
