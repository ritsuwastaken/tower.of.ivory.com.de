import { Head } from './Head'

export function ErrorPage({
  status,
  description,
}: {
  status: number
  description: string
}) {
  return (
    <>
      <Head description={description} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
        }}
      >
        <h1>
          {status} - {description}
        </h1>
      </div>
    </>
  )
}
