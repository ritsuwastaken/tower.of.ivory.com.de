import { useTranslation } from '@/hooks/useTranslation'

export const useFormatColumnName = () => {
  const { t, i18n, language } = useTranslation()
  return (key: string) =>
    i18n.exists(`columns.${key}`, { lng: language }) ? t(`columns.${key}`) : key
}
