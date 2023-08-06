<script lang="ts">
  import {
    CategoryScale,
    Chart,
    Legend,
    LineController,
    LineElement,
    LinearScale,
    PointElement,
    Tooltip,
  } from 'chart.js'
  import { onMount } from 'svelte'
  import type { WeekData } from '../../types'

  Chart.register(
    LineController,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Legend,
    Tooltip
  )

  export let measurements: WeekData['measurements']

  onMount(() => {
    const chart = new Chart(
      document.querySelector('#chart') as HTMLCanvasElement,
      {
        type: 'line',
        options: {
          responsive: true,
        },
        data: {
          labels: measurements.map(
            (measurement) => measurement.date + measurement.period
          ),
          datasets: [
            {
              label: 'Глюкоза',
              data: measurements.map((measurement) => measurement.glucose),
            },
          ],
        },
      }
    )

    return () => chart.destroy()
  })
</script>

<div class="grid">
  <canvas id="chart" />
</div>
