<script lang="ts">
  import MoonIcon from '../icons/MoonIcon.svelte'
  import SunIcon from '../icons/SunIcon.svelte'

  let darkMode = document.documentElement.classList.contains('dark')

  function toggleDarkMode() {
    document.documentElement.classList.toggle('dark')
    darkMode = document.documentElement.classList.contains('dark')

    if (darkMode) localStorage.setItem('theme', 'dark')
    else localStorage.setItem('theme', 'light')
  }
</script>

<button
  class="p-1.5 border-[1.5px] border-neutral-300 rounded-lg hover:bg-neutral-200 focus-visible:bg-neutral-200 active:bg-neutral-300 dark:border-neutral-600 dark:hover:bg-neutral-700 dark:focus-visible:bg-neutral-700 dark:active:bg-neutral-600 transition-colors"
  aria-label="Темная тема"
  on:click={toggleDarkMode}
>
  {#if darkMode}
    <SunIcon class="dark:text-white transition-colors" />
  {:else}
    <MoonIcon class="dark:text-white transition-colors" />
  {/if}
</button>
