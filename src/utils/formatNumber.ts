import { appConfig } from '@/config/appConfig'

export const formatNumberWithCommas = (value: number, fractionDigits = 2) =>
  new Intl.NumberFormat(appConfig.format.numberLocale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value)
