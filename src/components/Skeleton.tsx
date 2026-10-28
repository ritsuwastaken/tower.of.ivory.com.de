// @ts-ignore
import 'react-loading-skeleton/dist/skeleton.css'
import LoadingSkeleton, { SkeletonProps } from 'react-loading-skeleton'

export const Skeleton = (props: SkeletonProps) => (
  <LoadingSkeleton baseColor="#2a2a2a" highlightColor="#3a3a3a" {...props} />
)
