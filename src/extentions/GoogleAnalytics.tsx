import Script from "next/script";

interface Props {
  gtag: string
}

export default function GoogleAnalytics({ gtag } : Props) {
  return (
    <div className="container">
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${gtag}');
        `}
      </Script>
    </div>
  )
}