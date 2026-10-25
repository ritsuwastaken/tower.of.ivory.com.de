import ReactLoadingSkeleton, {
  type SkeletonProps,
} from 'react-loading-skeleton'

// @ts-ignore
import 'react-loading-skeleton/dist/skeleton.css'

export function Skeleton(props: SkeletonProps) {
  return <ReactLoadingSkeleton {...props} />
}
