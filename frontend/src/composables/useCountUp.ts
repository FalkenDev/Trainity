import { ref, watch, onMounted, type Ref } from 'vue'
import { CountUp } from 'countup.js'

export function useCountUp(
  elementRef: Ref<HTMLElement | null>,
  endValue: Ref<number>,
  options: {
    duration?: number
    prefix?: string
    suffix?: string
    decimals?: number
    separator?: string
    formattingFn?: (n: number) => string
  } = {}
) {
  const countUp = ref<CountUp | null>(null)
  const hasAnimated = ref(false)

  function initCountUp() {
    if (!elementRef.value || hasAnimated.value) return

    countUp.value = new CountUp(elementRef.value, endValue.value, {
      duration: options.duration ?? 1.5,
      prefix: options.prefix ?? '',
      suffix: options.suffix ?? '',
      decimals: options.decimals ?? 0,
      separator: options.separator ?? ',',
      formattingFn: options.formattingFn,
      useEasing: true,
      startVal: 0,
    })

    if (countUp.value.error) {
      console.error(countUp.value.error)
      return
    }

    // Use IntersectionObserver for scroll-triggered animation
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasAnimated.value) {
            hasAnimated.value = true
            countUp.value?.start()
            observer.disconnect()
          }
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(elementRef.value)
  }

  function update(newValue: number) {
    if (countUp.value && hasAnimated.value) {
      countUp.value.update(newValue)
    }
  }

  onMounted(() => {
    if (endValue.value > 0) {
      initCountUp()
    }
  })

  watch(endValue, (val) => {
    if (val > 0 && !hasAnimated.value) {
      initCountUp()
    } else if (val > 0 && hasAnimated.value) {
      update(val)
    }
  })

  return { update }
}
