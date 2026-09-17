const measurementId = process.env.NEXT_PUBLIC_GA_ID?.trim();
const validMeasurementId = measurementId && /^G-[A-Z0-9]+$/i.test(measurementId) ? measurementId : null;

export default function GoogleAnalytics() {
  if (!validMeasurementId) return null;

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${validMeasurementId}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${validMeasurementId}',{anonymize_ip:true});`,
        }}
      />
    </>
  );
}
