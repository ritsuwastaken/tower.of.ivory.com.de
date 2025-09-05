import { Head } from '@/components/Head'

export default function Custom400() {
  return (
    <>
      <Head description="Bad Request" />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
        }}
      >
        <h1>400 - Bad Request</h1>
      </div>
    </>
  )
}
