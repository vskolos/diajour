<script lang="ts">
  import clsx from 'clsx'
  import type { Entry } from '../../../server/schemas'
  import EntryModal from '../../components/EntryModal.svelte'

  let modal: EntryModal

  export let entry:
    | Pick<Entry, 'id' | 'date' | 'timePeriod' | 'glucose'>
    | undefined
</script>

{#if entry}
  <td
    class="grid py-2 sm:py-4 items-center border-e border-e-neutral-300 dark:border-e-neutral-600 transition-colors last:border-e-0"
  >
    <button
      on:click={modal.open}
      class={clsx(
        'text-lg text-center font-bold sm:text-2xl md:text-3xl transition-colors',
        entry.glucose < 2
          ? 'text-red-500 dark:text-red-600'
          : entry.glucose < 6
          ? 'text-orange-500 dark:text-orange-600'
          : entry.glucose < 18
          ? 'text-green-500 dark:text-green-600'
          : entry.glucose < 28
          ? 'text-sky-500 dark:text-sky-600'
          : 'text-purple-500 dark:text-purple-600'
      )}>{entry.glucose}</button
    >
    <EntryModal bind:this={modal} {entry} />
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
