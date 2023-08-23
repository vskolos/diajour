<script lang="ts">
  import clsx from 'clsx'
  import { createEventDispatcher } from 'svelte'
  import CheckIcon from '../icons/CheckIcon.svelte'
  import PlusIcon from '../icons/PlusIcon.svelte'
  import XMarkIcon from '../icons/XMarkIcon.svelte'

  export let label: string
  export let value: string
  export let unit: string

  const dispatch = createEventDispatcher<{ submit: { value: number | null } }>()

  let editMode = false
  let error = false

  // const validator: Action<HTMLInputElement> = (node) => {
  //   function handleFocus(this: HTMLInputElement) {
  //     this.selectionStart = 0
  //     this.selectionEnd = this.value.length
  //   }

  //   function handleChange(this: HTMLInputElement) {
  //     this.value = this.value.replaceAll(/[^0-9.]/g, '').slice(0, 3)
  //   }

  //   node.addEventListener('focus', handleFocus)
  //   node.addEventListener('input', handleChange)

  //   return {
  //     destroy: () => {
  //       node.removeEventListener('focus', handleFocus)
  //       node.removeEventListener('input', handleChange)
  //     },
  //   }
  // }

  function handleSubmit() {
    const parsed = parseFloat(value)
    if (value !== '' && isNaN(parsed)) return (error = true)

    dispatch('submit', { value: parsed || null })
    editMode = false
  }
</script>

{#if editMode}
  <form
    on:submit|preventDefault={handleSubmit}
    class="py-1 flex items-center gap-1 text-xs px-2 text-center rounded-md bg-neutral-100 transition-colors dark:bg-neutral-900 dark:text-white"
  >
    <input
      bind:value
      autofocus
      type="text"
      inputmode="decimal"
      class={clsx(
        'bg-transparent text-center',
        error && 'text-red-500 dark:text-red-600 transition-colors'
      )}
      size={3}
    />
    <button type="submit">
      <CheckIcon class="w-2.5 h-2.5" />
    </button>
    <button type="button" on:click={() => (editMode = false)}>
      <XMarkIcon class="w-2.5 h-2.5" />
    </button>
  </form>
{:else if value}
  <button
    class="py-1 flex items-center gap-1 text-xs px-2 text-center rounded-md bg-neutral-100 transition-colors dark:bg-neutral-900 dark:text-white"
    on:click={() => {
      editMode = true
    }}
  >
    {value}
    {unit}
  </button>
{:else}
  <button
    class="py-1 flex items-center gap-1 text-xs px-2 text-center rounded-md bg-neutral-100 transition-colors dark:bg-neutral-900 dark:text-white"
    on:click={() => {
      editMode = true
    }}
  >
    <PlusIcon class="w-2.5 h-2.5" />
    {label}
  </button>
{/if}
