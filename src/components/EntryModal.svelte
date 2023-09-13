<script lang="ts">
  import clsx from 'clsx'
  import { format, parse, startOfWeek } from 'date-fns'
  import ru from 'date-fns/locale/ru'
  import type { Entry } from '../../server/schemas'
  import TrashIcon from '../icons/TrashIcon.svelte'
  import XMarkIcon from '../icons/XMarkIcon.svelte'
  import { trpc } from '../main'
  import type { TimePeriod } from '../types'
  import Modal from './Modal.svelte'

  let modal: Modal

  export const open = () => {
    modal.open()
    setDefaults()
  }
  export let entry:
    | Pick<Entry, 'id' | 'date' | 'timePeriod' | 'glucose'>
    | undefined = undefined

  let date: string
  let timePeriod: TimePeriod
  let glucose: string
  let error: string

  function invalidateEntryListAndCloseModal(date: string) {
    trpc.entry.list.utils.invalidate({
      weekStart: format(
        startOfWeek(parse(date, 'yyyy-MM-dd', new Date()), {
          weekStartsOn: 1,
        }),
        'yyyy-MM-dd'
      ),
    })
    modal.close()
  }

  const createEntry = trpc.entry.create.mutation({
    onSuccess: () => invalidateEntryListAndCloseModal(date),
  })

  const updateEntry = trpc.entry.update.mutation({
    onSuccess: () => invalidateEntryListAndCloseModal(date),
  })

  const deleteEntry = trpc.entry.delete.mutation({
    onSuccess: () => invalidateEntryListAndCloseModal(date),
  })

  function setDefaults() {
    const now = new Date()
    const currentHour = now.getHours()

    date = entry ? entry.date : format(now, 'yyyy-MM-dd', { locale: ru })
    timePeriod = entry
      ? entry.timePeriod
      : currentHour < 12
      ? 'morning'
      : currentHour < 18
      ? 'midday'
      : 'evening'
    glucose = entry ? `${entry.glucose}` : ''
    error = ''

    $createEntry.reset()
    $updateEntry.reset()
  }

  function handleSubmit() {
    error = ''
    if (!glucose) return (error = 'Введите уровень глюкозы')

    const parsedGlucose = parseFloat(glucose.replaceAll(',', '.'))
    if (!parsedGlucose) return (error = 'Введите корректное число')

    if (entry) $updateEntry.mutate({ date, timePeriod, glucose: parsedGlucose })
    else $createEntry.mutate({ date, timePeriod, glucose: parsedGlucose })
  }

  function handleDelete() {
    if (!entry) return (error = 'Невозможно удалить запись')
    $deleteEntry.mutate({ id: entry.id })
  }
</script>

<Modal bind:this={modal} onClose={setDefaults}>
  <form
    class="p-6 rounded-2xl bg-white dark:bg-neutral-800 grid gap-4 transition-colors shadow-card dark:shadow-card-dark max-w-sm"
    on:submit|preventDefault={handleSubmit}
  >
    <div class="flex items-center justify-between gap-2">
      <h3
        class="text-xl md:text-2xl font-bold dark:text-white transition-colors"
      >
        {entry ? 'Изменить замер' : 'Добавить замер'}
      </h3>
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
            class="grid p-2 place-items-center font-medium border-e border-e-neutral-300 dark:border-e-neutral-600 text-black dark:text-white transition-colors"
          >
            Дата
          </td>
          <td class="grid">
            <input
              class="flex px-2 appearance-none bg-transparent text-black dark:text-white dark:[color-scheme:dark] text-center cursor-pointer transition-colors"
              type="date"
              bind:value={date}
            />
          </td>
        </tr>
        <tr
          class="grid grid-cols-2 border-b border-b-neutral-300 dark:border-b-neutral-600 last:border-b-0"
        >
          <td
            class="grid p-2 place-items-center font-medium border-e border-e-neutral-300 dark:border-e-neutral-600 text-black dark:text-white transition-colors"
          >
            Период
          </td>
          <td class="grid">
            <select
              bind:value={timePeriod}
              class="px-2 appearance-none bg-transparent text-black dark:text-white dark:[color-scheme:dark] text-center w-full cursor-pointer transition-colors"
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
              autofocus
              class={clsx(
                'px-2 bg-transparent w-full text-black dark:text-white dark:[color-scheme:dark] text-center placeholder:text-neutral-400 transition-colors placeholder:transition-colors',
                error &&
                  'placeholder:text-red-500 dark:placeholder:text-red-600'
              )}
              type="text"
              inputmode="decimal"
              placeholder="15.5"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <div class="flex items-center gap-2">
      {#if entry}
        <button
          type="button"
          on:click={handleDelete}
          class="flex flex-shrink-0 items-center justify-center rounded-xl p-4 bg-red-600 hover:bg-red-700 focus-visible:bg-red-700 active:bg-red-800 transition-colors dark:bg-red-300 dark:hover:bg-red-200 dark:focus-visible:bg-red-200 dark:active:bg-red-100"
        >
          <TrashIcon class="text-white dark:text-black transition-colors" />
        </button>
      {/if}
      <button
        type="submit"
        class="flex flex-grow items-center justify-center rounded-xl p-4 bg-neutral-600 hover:bg-neutral-700 focus-visible:bg-neutral-700 active:bg-neutral-800 transition-colors dark:bg-neutral-300 dark:hover:bg-neutral-200 dark:focus-visible:bg-neutral-200 dark:active:bg-neutral-100"
      >
        <span class="text-white dark:text-black transition-colors font-medium">
          Сохранить
        </span>
      </button>
    </div>
    {#if error}
      <div
        class="text-sm text-center text-red-500 dark:text-red-600 transition-colors"
      >
        {error}
      </div>
    {/if}
    {#if $createEntry.error}
      <div
        class="text-sm text-center text-red-500 dark:text-red-600 transition-colors"
      >
        {$createEntry.error.message}
      </div>
    {/if}
    {#if $updateEntry.error}
      <div
        class="text-sm text-center text-red-500 dark:text-red-600 transition-colors"
      >
        {$updateEntry.error.message}
      </div>
    {/if}
  </form>
</Modal>
