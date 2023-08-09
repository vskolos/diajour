<script lang="ts">
  import clsx from 'clsx'
  import { format } from 'date-fns'
  import ru from 'date-fns/locale/ru'
  import XMarkIcon from '../icons/XMarkIcon.svelte'
  import type { TimePeriod } from '../types'
  import Modal from './Modal.svelte'

  let modal: Modal

  export const open = () => modal.open()

  let date: string
  let timePeriod: TimePeriod
  let glucose: string
  let error: string

  function setDefaults() {
    const now = new Date()
    const currentHour = now.getHours()

    date = format(now, 'yyyy-MM-dd', { locale: ru })
    timePeriod =
      currentHour < 12 ? 'morning' : currentHour < 18 ? 'midday' : 'evening'
    glucose = ''
    error = ''
  }

  setDefaults()

  function handleSubmit() {
    if (!glucose) {
      error = 'Введите показания глюкозы'
      return
    }

    modal.close()
  }
</script>

<Modal bind:this={modal} onClose={setDefaults}>
  <form
    class="p-6 rounded-2xl bg-white dark:bg-neutral-800 grid gap-4 transition-colors shadow-card dark:shadow-card-dark max-w-sm"
    on:submit|preventDefault={handleSubmit}
  >
    <div class="flex items-center justify-between gap-2">
      <div class="grid">
        <h3
          class="text-xl md:text-2xl font-bold dark:text-white transition-colors"
        >
          Добавить замер
        </h3>

        {#if error}
          <div class="text-xs md:text-sm text-red-500 dark:text-red-600">
            {error}
          </div>
        {/if}
      </div>
      <button
        type="button"
        class="p-2 rounded-lg hover:bg-neutral-300 focus-visible:bg-neutral-300 active:bg-neutral-600 transition-colors dark:hover:bg-neutral-600 dark:focus-visible:bg-neutral-600 dark:active:bg-neutral-300 group"
        on:click={() => modal.close()}
      >
        <XMarkIcon
          class="dark:text-white transition-colors group-active:text-white dark:group-active:text-black"
        />
      </button>
    </div>
    <table
      class="grid rounded-lg border border-neutral-300 dark:border-neutral-600 transition-colors"
    >
      <tbody class="grid">
        <tr
          class="grid grid-cols-2 border-b border-b-neutral-300 dark:border-b-neutral-600 last:border-b-0"
        >
          <td
            class="grid p-2 place-items-center font-medium border-e border-e-neutral-300 dark:border-e-neutral-600 text-black dark:text-white"
          >
            Дата
          </td>
          <td class="grid">
            <input
              class="flex px-2 appearance-none bg-transparent text-black dark:text-white dark:[color-scheme:dark] text-center cursor-pointer"
              type="date"
              bind:value={date}
            />
          </td>
        </tr>
        <tr
          class="grid grid-cols-2 border-b border-b-neutral-300 dark:border-b-neutral-600 last:border-b-0"
        >
          <td
            class="grid p-2 place-items-center font-medium border-e border-e-neutral-300 dark:border-e-neutral-600 text-black dark:text-white"
          >
            Период
          </td>
          <td class="grid">
            <select
              bind:value={timePeriod}
              class="px-2 appearance-none bg-transparent text-black dark:text-white dark:[color-scheme:dark] text-center w-full cursor-pointer"
            >
              <option value="morning">Утро</option>
              <option value="midday">День</option>
              <option value="evening">Вечер</option>
            </select>
          </td>
        </tr>
        <tr
          class="grid grid-cols-2 border-b border-b-neutral-300 dark:border-b-neutral-600 last:border-b-0"
        >
          <td
            class="grid p-2 place-items-center font-medium border-e border-e-neutral-300 dark:border-e-neutral-600 text-black dark:text-white"
          >
            Глюкоза
          </td>
          <td class="grid">
            <input
              bind:value={glucose}
              class={clsx(
                'px-2 bg-transparent w-full text-black dark:text-white dark:[color-scheme:dark] text-center placeholder:text-neutral-400',
                error &&
                  'placeholder:text-red-500 dark:placeholder:text-red-600'
              )}
              type="text"
              inputmode="numeric"
              placeholder="15.5"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <button
      type="submit"
      class="flex items-center justify-center rounded-lg md:rounded-xl py-2 px-3 md:p-4 bg-neutral-600 hover:bg-neutral-700 focus-visible:bg-neutral-700 active:bg-neutral-800 transition-colors dark:bg-neutral-300 dark:hover:bg-neutral-200 dark:focus-visible:bg-neutral-200 dark:active:bg-neutral-100"
    >
      <span class="md:text-lg text-white dark:text-black transition-colors">
        Сохранить
      </span>
    </button>
  </form>
</Modal>
