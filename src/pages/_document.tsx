import Document, { Html, Head, Main, NextScript } from "next/document";

export default class EarwormsDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#581c87" />
          <meta name="author" content="John" />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link
            rel="icon"
            href="/favicon-16x16.svg"
            type="image/svg+xml"
            sizes="16x16"
          />
          <link
            rel="icon"
            href="/favicon.svg"
            type="image/svg+xml"
            sizes="32x32"
          />
          <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
          <link rel="shortcut icon" href="/favicon.svg" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
