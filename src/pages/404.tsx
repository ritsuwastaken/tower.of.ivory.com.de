import { Head } from '@/components/Head'

export default function Custom404() {
  const isGhPages = process.env.GITHUB_PAGES === '1'

  return (
    <>
      <Head description="Page Not Found" />
      {isGhPages && (
        <>
          <script
            dangerouslySetInnerHTML={{
              __html: `
  sessionStorage.redirect = location.href;
              `,
            }}
          />
          <meta httpEquiv="refresh" content="0;URL='/tower.of.ivory.com.de'" />
        </>
      )}
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
