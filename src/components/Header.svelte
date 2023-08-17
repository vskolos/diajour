<script lang="ts">
  import PowerIcon from '../icons/PowerIcon.svelte'
  import UserIcon from '../icons/UserIcon.svelte'
  import { trpc } from '../main'
  import { loggedIn } from '../stores'
  import DarkModeButton from './DarkModeButton.svelte'

  const user = trpc.user.data.query()

  const logout = trpc.user.logout.mutation({
    onSuccess: () => {
      $loggedIn = false
    },
  })
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
      Кот Диажур
    </h1>
    <span class="text-xs text-neutral-400"
      >Журнал замеров <span class="hidden sm:inline">глюкозы</span></span
    >
  </div>
  <div class="flex items-center gap-2">
    {#if $user.data}
      <span
        class="font-medium hidden sm:inline dark:text-white transition-colors"
        >{$user.data.username}</span
      >
    {/if}
    <button
      class="p-1.5 border-[1.5px] border-neutral-300 rounded-lg hover:bg-neutral-200 focus-visible:bg-neutral-200 active:bg-neutral-300 dark:border-neutral-600 dark:hover:bg-neutral-700 dark:focus-visible:bg-neutral-700 dark:active:bg-neutral-600 transition-colors"
      aria-label="Профиль"
    >
      <UserIcon class="dark:text-white transition-colors" />
    </button>
    <DarkModeButton />
    <button
      class="p-1.5 border-[1.5px] border-neutral-300 rounded-lg hover:bg-neutral-200 focus-visible:bg-neutral-200 active:bg-neutral-300 dark:border-neutral-600 dark:hover:bg-neutral-700 dark:focus-visible:bg-neutral-700 dark:active:bg-neutral-600 transition-colors"
      aria-label="Выйти"
      on:click={() => $logout.mutate()}
    >
      <PowerIcon class="dark:text-white transition-colors" />
    </button>
  </div>
</header>
