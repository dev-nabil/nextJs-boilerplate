import { formatPrice } from '@/lib/utils'
import { PriceSetting } from '@/types'
const priceSetting: PriceSetting = {
  minPrice: 100,
  maxPrice: 9999999
}

export const validateStepFields = async (fields: string[], trigger: any): Promise<boolean> => {
  return await trigger(fields as any, { shouldFocus: true })
}

export const validateSubCategories = (
  currentStep: number,
  categoryData: any,
  subCategories: any[],
  setError: any,
  clearErrors: any
): boolean => {
  if (currentStep === 1) {
    if (categoryData?.value && (!subCategories || subCategories.length === 0)) {
      setError('subCategories', {
        type: 'manual',
        message: 'At least one skill is required'
      })
      return false
    } else {
      clearErrors('subCategories')
    }
  }
  return true
}
export const validateHourlyRates = (
  minAmount: number,
  maxAmount: number,
  setError: any,
  clearErrors: any,
  validateNumericInput: any
): boolean => {
  let valid = true
  clearErrors('fixedAmount')

  const { minPrice, maxPrice } = priceSetting

  if (minAmount < minPrice) {
    setError('minAmount', { type: 'manual', message: `Minimum price must be at least ${formatPrice(minPrice)}` })
    valid = false
  } else if (!validateNumericInput(minAmount)) {
    setError('minAmount', { type: 'manual', message: 'Please enter a valid positive number' })
    valid = false
  } else if (minAmount > maxPrice) {
    setError('minAmount', { type: 'manual', message: `Minimum price must not exceed ${formatPrice(maxPrice)}` })
    valid = false
  } else {
    clearErrors('minAmount')
  }

  if (maxAmount < minPrice) {
    setError('maxAmount', { type: 'manual', message: `Maximum price must be at least ${formatPrice(minPrice)}` })
    valid = false
  } else if (!validateNumericInput(maxAmount)) {
    setError('maxAmount', { type: 'manual', message: 'Please enter a valid positive number' })
    valid = false
  } else if (maxAmount > maxPrice) {
    setError('maxAmount', { type: 'manual', message: `Maximum price must not exceed ${formatPrice(maxPrice)}` })
    valid = false
  } else if (minAmount >= maxAmount) {
    setError('maxAmount', { type: 'manual', message: 'Maximum must be greater than minimum' })
    valid = false
  } else if (minAmount >= maxAmount) {
    setError('maxAmount', { type: 'manual', message: 'Maximum must be greater than minimum' })
    valid = false
  } else {
    clearErrors('maxAmount')
  }

  return valid
}

export const validateFixedAmount = (fixedAmount: number, setError: any, clearErrors: any, validateNumericInput: any): boolean => {
  clearErrors(['minAmount', 'maxAmount'])

  const { minPrice, maxPrice } = priceSetting

  if (fixedAmount < minPrice) {
    setError('fixedAmount', { type: 'manual', message: `Fixed amount must be at least ${formatPrice(minPrice)}` })
    return false
  } else if (!validateNumericInput(fixedAmount)) {
    setError('fixedAmount', { type: 'manual', message: 'Please enter a valid positive number' })
    return false
  } else if (fixedAmount > maxPrice) {
    setError('fixedAmount', { type: 'manual', message: `Fixed amount must not exceed ${formatPrice(maxPrice)}` })
    return false
  } else {
    clearErrors('fixedAmount')
  }

  return true
}
