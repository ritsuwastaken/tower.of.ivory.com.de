import { useTranslation } from '@/hooks/useTranslation'
import styled from 'styled-components'

export function Footer() {
  const { t } = useTranslation()
  return (
    <FooterWrapper>
      <Container>
        <Text>{t('footer.text')}</Text>
      </Container>
    </FooterWrapper>
  )
}

const FooterWrapper = styled.footer`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 0.5rem 0;
  width: 100%;
  flex-shrink: 0;
  border-top-width: 1px;
  border-radius: ${({ theme }) => theme.radii.panel};
  margin-top: ${({ theme }) => theme.spacing.lg};
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column-reverse;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`

const Text = styled.p`
  color: ${({ theme }) => theme.colors.footerText};
  font-size: ${({ theme }) => theme.typography.caption};
  margin: 0;
`
