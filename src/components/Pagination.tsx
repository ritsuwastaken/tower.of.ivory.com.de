import { useTranslation } from '@/hooks/useTranslation'
import styled from 'styled-components'
import { controlStyles } from './Control.styles'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const { t } = useTranslation()
  return (
    <PaginationWrapper>
      <PaginationButton
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        ««
      </PaginationButton>
      <PaginationButton
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
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
        disabled={currentPage === totalPages}
      >
        »
      </PaginationButton>
      <PaginationButton
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
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
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 1rem 0;
`

const PaginationButton = styled.button`
  ${controlStyles}
  min-width: var(--control-height);
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    background-color: ${({ theme }) => theme.colors.hover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    background-color: ${({ theme }) => theme.colors.hover};
  }
`

const PaginationInfo = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  padding: 0 0.5rem;
  font-size: ${({ theme }) => theme.typography.small};
`

const DesktopOnly = styled.span`
  display: inline;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`

const MobileOnly = styled.span`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: inline;
  }
`
