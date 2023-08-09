<script lang="ts">
  let dialog: HTMLDialogElement

  export let onClose: () => void = () => {}

  export const open = () => dialog.showModal()
  export const close = () => {
    onClose()
    dialog.close()
  }

  function handleClick(event: MouseEvent) {
    const rect = dialog.getBoundingClientRect()
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      close()
  }
</script>

<dialog
  on:click={handleClick}
  class="bg-transparent transition-colors p-4 backdrop:backdrop-blur-sm backdrop:bg-black/25 dark:backdrop:bg-white/25 backdrop:cursor-pointer"
  bind:this={dialog}
>
  <slot />
</dialog>
