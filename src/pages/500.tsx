import { Head } from '@/components/Head'

export default function Custom500() {
  return (
    <>
      <Head description="Internal Server Error" />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
        }}
      >
        <h1>500 - Internal Server Error</h1>
      </div>
    </>
  )
}
