import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function IndexPage() {
  const router = useRouter()
  const isGhPages = process.env.GITHUB_PAGES === '1'

  useEffect(() => {
    router.replace('/armorsets')
  }, [router])

  return (
    <>
      {isGhPages && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
  (function(){
    var redirect = sessionStorage.redirect;
    delete sessionStorage.redirect;
    if (redirect && redirect != location.href) {
      history.replaceState(null, null, redirect);
    }
  })();
            `,
          }}
        />
      )}
    </>
  )
}
