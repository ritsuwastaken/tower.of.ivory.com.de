import { Head } from '@/components/Head'

export default function Custom404() {
  return (
    <>
      <Head description="Page Not Found" />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
        }}
      >
        <h1>404 - Page Not Found</h1>
      </div>
    </>
  )
}
