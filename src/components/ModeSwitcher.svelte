<script lang="ts">
  import ChartIcon from '../icons/ChartIcon.svelte'
  import TableIcon from '../icons/TableIcon.svelte'
  import { mode } from '../stores'

  const localStorageMode = localStorage.getItem('mode')

  if (localStorageMode === 'table' || localStorageMode === 'chart')
    mode.set(localStorageMode)
  else localStorage.setItem('mode', $mode)
</script>

<button
  class="p-2 rounded-lg hover:bg-neutral-300 focus-visible:bg-neutral-300 active:bg-neutral-600 disabled:bg-neutral-600 transition-colors dark:hover:bg-neutral-600 dark:focus-visible:bg-neutral-600 dark:active:bg-neutral-300 dark:disabled:bg-neutral-300 group"
  disabled={$mode === 'table'}
  on:click={() => {
    mode.set('table')
    localStorage.setItem('mode', 'table')
  }}
>
  <TableIcon
    class="dark:text-white transition-colors group-disabled:text-white group-active:text-white dark:group-active:text-black dark:group-disabled:text-black"
  /></button
>
<button
  class="p-2 rounded-lg hover:bg-neutral-300 focus-visible:bg-neutral-300 active:bg-neutral-600 disabled:bg-neutral-600 transition-colors dark:hover:bg-neutral-600 dark:focus-visible:bg-neutral-600 dark:active:bg-neutral-300 dark:disabled:bg-neutral-300 group"
  disabled={$mode === 'chart'}
  on:click={() => {
    mode.set('chart')
    localStorage.setItem('mode', 'chart')
  }}
  ><ChartIcon
    class="dark:text-white transition-colors group-disabled:text-white group-active:text-white dark:group-active:text-black dark:group-disabled:text-black"
  /></button
>
