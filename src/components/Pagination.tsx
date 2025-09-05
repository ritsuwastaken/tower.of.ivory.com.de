import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  disabled?: boolean
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}: PaginationProps) => {
  const { t } = useTranslation()
  return (
    <PaginationWrapper>
      <PaginationButton
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1 || disabled}
      >
        ««
      </PaginationButton>
      <PaginationButton
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1 || disabled}
      >
        «
      </PaginationButton>
      <PaginationInfo>
        <DesktopOnly>
          {t('pagination.pageInfo', {
            current: currentPage,
            total: totalPages,
          })}
        </DesktopOnly>
        <MobileOnly>
          {currentPage}/{totalPages}
        </MobileOnly>
      </PaginationInfo>
      <PaginationButton
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages || disabled}
      >
        »
      </PaginationButton>
      <PaginationButton
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages || disabled}
      >
        »»
      </PaginationButton>
    </PaginationWrapper>
  )
}

const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 1rem 0;
`

const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #3a3a3a;
  border-radius: 4px;
  background-color: #2a2a2a;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    background-color: #3a3a3a;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    background-color: #3a3a3a;
  }
`

const PaginationInfo = styled.span`
  color: #888;
  padding: 0 1rem;
`

const DesktopOnly = styled.span`
  display: inline;

  @media (max-width: 768px) {
    display: none;
  }
`

const MobileOnly = styled.span`
  display: none;

  @media (max-width: 768px) {
    display: inline;
  }
`
