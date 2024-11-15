interface RequestMetrics {
  duration: number
  timestamp: Date
  status: number
}

async function measureRequest(url: string): Promise<RequestMetrics> {
  const start = performance.now()
  const response = await fetch(url)
  const end = performance.now()

  return {
    duration: end - start,
    timestamp: new Date(),
    status: response.status,
  }
}

function calculateMedian(numbers: number[]): number {
  const sorted = [...numbers].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2
  }
  return sorted[middle]
}

async function runBenchmark(url: string, iterations: number = 500) {
  console.log(`Starting benchmark for ${url}`)
  console.log(`Running ${iterations} iterations...`)

  const results: RequestMetrics[] = []
  const errors: Error[] = []

  for (let i = 0; i < iterations; i++) {
    try {
      const progress = Math.round((i / iterations) * 100)
      process.stdout.write(`\rProgress: ${progress}% (${i}/${iterations})`)

      const result = await measureRequest(url)
      results.push(result)

      // small delay to prevent spamming
      await new Promise((resolve) => setTimeout(resolve, 10))
    } catch (error) {
      errors.push(error as Error)
    }
  }

  console.log("\n\nBenchmark complete!")

  const durations = results.map((r) => r.duration)
  const average = durations.reduce((a, b) => a + b, 0) / durations.length
  const median = calculateMedian(durations)

  console.log("\nResults:")
  console.log("-".repeat(50))
  console.log(`Total Requests: ${results.length}`)
  console.log(`Failed Requests: ${errors.length}`)
  console.log(`Average Latency: ${average.toFixed(2)}ms`)
  console.log(`Median Latency: ${median.toFixed(2)}ms`)
  console.log(`Min Latency: ${Math.min(...durations).toFixed(2)}ms`)
  console.log(`Max Latency: ${Math.max(...durations).toFixed(2)}ms`)

  // this was the code run during the video, i forgot to sort these for percentiles first
  // i.e. it SHOULD be:
  /**
   * const sortedDurations = [...durations].sort((a, b) => a - b)
     const p95 = sortedDurations[Math.floor(sortedDurations.length * 0.95)]
     const p99 = sortedDurations[Math.floor(sortedDurations.length * 0.99)]
   */
  const p95 = durations[Math.floor(durations.length * 0.95)]
  const p99 = durations[Math.floor(durations.length * 0.99)]
  console.log(`95th Percentile: ${p95.toFixed(2)}ms`)
  console.log(`99th Percentile: ${p99.toFixed(2)}ms`)

  if (errors.length > 0) {
    console.log("\nErrors encountered:")
    errors.forEach((error, index) => {
      console.log(`Error ${index + 1}: ${error.message}`)
    })
  }
}

const url = process.argv[2]
runBenchmark(url).catch(console.error)
