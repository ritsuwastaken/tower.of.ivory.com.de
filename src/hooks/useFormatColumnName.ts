import { useTranslation } from 'react-i18next'

const defaultFormat = (key: string) =>
  key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

export const useFormatColumnName = () => {
  const { t } = useTranslation()
  return (key: string) =>
    t(`columns.${key}`, { defaultValue: defaultFormat(key) })
}
