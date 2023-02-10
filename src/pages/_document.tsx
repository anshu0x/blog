import { Html, Head, Main, NextScript } from "next/document";
import { Partytown } from "@builder.io/partytown/react";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300..700&display=swap"
          rel="stylesheet"
        />
        <Partytown debug={true} forward={["dataLayer.push"]} />
        <Script
          strategy="worker"
          async
          crossOrigin="anonymous"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4780451799247980"
          type="text/partytown"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
