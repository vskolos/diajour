<script lang="ts">
  import clsx from 'clsx'
  import { trpc } from '../main'
  import { loggedIn } from '../stores'
  import DarkModeButton from './DarkModeButton.svelte'

  let username = ''
  let password = ''

  // const signup = trpc.user.signup.mutation({
  //   onSuccess: () => {
  //     username = ''
  //     password = ''
  //   },
  // })

  const login = trpc.user.login.mutation({
    onSuccess: () => {
      $loggedIn = true
    },
  })
</script>

<form
  class="p-6 rounded-2xl bg-white dark:bg-neutral-800 grid gap-4 transition-colors shadow-card dark:shadow-card-dark w-full max-w-xs"
  on:submit|preventDefault={() => $login.mutate({ username, password })}
>
  <div class="flex items-center gap-2 justify-between">
    <div class="grid">
      <h3 class="text-2xl font-bold dark:text-white transition-colors">
        Кот Диажур
      </h3>
      <span class="text-neutral-400">Журнал замеров глюкозы</span>
    </div>
    <DarkModeButton />
  </div>
  <label class="grid relative items-center">
    <span
      class={clsx(
        'absolute start-4 font-medium text-neutral-400 transition-[transform,font-size,line-height]',
        username && '-translate-y-2.5 text-sm'
      )}>Логин</span
    >
    <input
      class={clsx(
        'flex p-4 font-medium rounded-xl border border-neutral-300 dark:border-neutral-600 bg-transparent text-black dark:text-white transition-colors',
        username && 'pb-2 pt-6'
      )}
      type="text"
      bind:value={username}
    />
  </label>
  <label class="grid relative items-center">
    <span
      class={clsx(
        'absolute start-4 font-medium text-neutral-400 transition-[transform,font-size,line-height]',
        password && '-translate-y-2 text-sm'
      )}>Пароль</span
    >
    <input
      class={clsx(
        'flex p-4 font-medium rounded-xl border border-neutral-300 dark:border-neutral-600 bg-transparent text-black dark:text-white transition-colors',
        password && 'pb-2 pt-6'
      )}
      type="password"
      bind:value={password}
    />
  </label>
  <button
    type="submit"
    class="flex items-center justify-center rounded-xl p-4 bg-neutral-600 hover:bg-neutral-700 focus-visible:bg-neutral-700 active:bg-neutral-800 transition-colors dark:bg-neutral-300 dark:hover:bg-neutral-200 dark:focus-visible:bg-neutral-200 dark:active:bg-neutral-100"
  >
    <span class="text-white dark:text-black transition-colors">Войти</span>
  </button>
  {#if $login.error}
    <div
      class="text-sm text-center text-red-500 dark:text-red-600 transition-colors"
    >
      {$login.error.message}
    </div>
  {/if}
</form>

<!-- <div class="grid gap-8 justify-items-center">
  <form
    on:submit|preventDefault={() => $signup.mutate({ username, password })}
    class="grid gap-4 p-4 bg-white"
  >
    <span>Регистрация</span>
    {#if $signup.error}
      <span class="text-red-600">{$signup.error.message}</span>
    {/if}
    <input
      type="text"
      placeholder="Логин"
      bind:value={username}
      class="border"
    />
    <input
      type="password"
      placeholder="Пароль"
      bind:value={password}
      class="border"
    />
    <button type="submit">Зарегистрироваться</button>
  </form>
</div> -->
