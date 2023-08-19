<script lang="ts">
  import { QueryClientProvider } from '@tanstack/svelte-query'
  import AuthForm from './components/AuthForm.svelte'
  import EntryModal from './components/EntryModal.svelte'
  import Header from './components/Header.svelte'
  import ModeSwitcher from './components/ModeSwitcher.svelte'
  import WeekInfo from './components/WeekInfo.svelte'
  import WeekPicker from './components/WeekPicker.svelte'
  import Chart from './features/Chart/Chart.svelte'
  import Table from './features/Table/Table.svelte'
  import PlusIcon from './icons/PlusIcon.svelte'
  import { trpc } from './main'
  import { loggedIn, mode } from './stores'

  let modal: EntryModal
</script>

<QueryClientProvider client={trpc.queryClient}>
  {#if $loggedIn}
    <Header />

    <main
      class="grid gap-4 sm:gap-5 py-4 sm:py-5 lg:grid-cols-4 lg:items-start"
    >
      <aside class="grid gap-4 sm:gap-5">
        <WeekPicker />
        <button
          class="flex items-center justify-center rounded-xl gap-1 p-4 bg-neutral-600 fixed end-4 bottom-4 sm:end-5 sm:bottom-5 lg:static hover:bg-neutral-700 focus-visible:bg-neutral-700 active:bg-neutral-800 transition-colors dark:bg-neutral-300 dark:hover:bg-neutral-200 dark:focus-visible:bg-neutral-200 dark:active:bg-neutral-100 shadow-[0px_0px_4px_0px] shadow-neutral-600 dark:shadow-neutral-300"
          on:click={modal.open}
        >
          <PlusIcon class="text-white dark:text-black transition-colors" />
          <span
            class="hidden lg:block text-lg text-white dark:text-black transition-colors"
          >
            Добавить замер
          </span>
        </button>
        <EntryModal bind:this={modal} />
      </aside>

      <div
        class="bg-white rounded-2xl lg:col-span-3 p-4 sm:p-6 grid gap-4 shadow-card dark:bg-neutral-800 dark:shadow-card-dark transition-colors"
      >
        <div class="flex gap-2 items-center">
          <WeekInfo class="me-auto" />
          <ModeSwitcher />
        </div>

        {#if $mode === 'table'}
          <Table />
        {:else if $mode === 'chart'}
          <Chart />
        {/if}
      </div>
    </main>
  {:else}
    <main
      class="grid gap-4 sm:gap-5 min-h-full place-items-center py-4 sm:py-5"
    >
      <AuthForm />
    </main>
  {/if}
</QueryClientProvider>
