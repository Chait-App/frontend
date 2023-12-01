"use client";
import styles from "./layout.module.css"

export default function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
      </head>
      <body>
       <div
          className={styles.header}
        >Base Layout</div>
        <div>
          {children}
        </div>
      </body>
    </html>)
}
