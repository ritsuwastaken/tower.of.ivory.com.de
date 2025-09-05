import { useTranslation } from 'react-i18next'
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
  background-color: #1a1a1a;
  padding: 0.5rem 0;
  width: 100%;
  flex-shrink: 0;
  border-top-width: 1px;
  border-radius: 8px;
  margin-top: 1rem;
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    gap: 0.5rem;
  }
`

const Text = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
  margin: 0;
`
