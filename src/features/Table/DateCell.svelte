<script lang="ts">
  import { format, getDay } from 'date-fns'
  import ru from 'date-fns/locale/ru'
  import { WEEK_DAYS } from '../../constants'

  export let date: Date
</script>

<th
  class="grid py-2 sm:py-4 items-center border-e border-e-neutral-300 dark:border-e-neutral-600 transition-colors last:border-e-0"
>
  <span
    class="text-sm md:text-base text-center font-bold dark:text-white transition-colors"
    >{WEEK_DAYS[getDay(date)]}</span
  >
  <span
    class="text-2xs sm:text-xs font-normal md:text-sm text-center text-neutral-400"
    >{format(date, 'd MMM', {
      locale: ru,
    }).replace('.', '')}</span
  >
</th>
