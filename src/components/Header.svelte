<script lang="ts">
  import MoonIcon from '../icons/MoonIcon.svelte'
  import PowerIcon from '../icons/PowerIcon.svelte'
  import SunIcon from '../icons/SunIcon.svelte'
  import UserIcon from '../icons/UserIcon.svelte'

  let darkMode = document.documentElement.classList.contains('dark')

  function toggleDarkMode() {
    document.documentElement.classList.toggle('dark')
    darkMode = document.documentElement.classList.contains('dark')

    if (darkMode) localStorage.setItem('theme', 'dark')
    else localStorage.setItem('theme', 'light')
  }
</script>

<header
  class="bg-white rounded-2xl p-4 flex gap-3 items-center shadow-card dark:bg-neutral-800 dark:shadow-card-dark transition-colors"
>
  <img
    class="w-11 h-11 flex-shrink-0"
    src="/images/logo.webp"
    srcset="/images/logo@2x.webp 2x"
    alt="Логотип приложения, на котором изображен кот, держащий инсулиновый шприц"
  />
  <div class="grid me-auto">
    <h1 class="text-lg font-bold dark:text-white transition-colors">
      Diacates
    </h1>
    <span class="text-xs text-neutral-400"
      >Дневник замеров <span class="hidden sm:inline">глюкозы</span></span
    >
  </div>
  <div class="flex items-center gap-2">
    <span class="font-medium hidden sm:inline dark:text-white transition-colors"
      >vskolos</span
    >
    <button
      class="p-1.5 border-[1.5px] border-neutral-300 rounded-lg hover:bg-neutral-200 focus-visible:bg-neutral-200 active:bg-neutral-300 dark:border-neutral-600 dark:hover:bg-neutral-700 dark:focus-visible:bg-neutral-700 dark:active:bg-neutral-600 transition-colors"
      aria-label="Профиль"
    >
      <UserIcon class="dark:text-white transition-colors" />
    </button>
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
    <button
      class="p-1.5 border-[1.5px] border-neutral-300 rounded-lg hover:bg-neutral-200 focus-visible:bg-neutral-200 active:bg-neutral-300 dark:border-neutral-600 dark:hover:bg-neutral-700 dark:focus-visible:bg-neutral-700 dark:active:bg-neutral-600 transition-colors"
      aria-label="Выйти"
    >
      <PowerIcon class="dark:text-white transition-colors" />
    </button>
  </div>
</header>
