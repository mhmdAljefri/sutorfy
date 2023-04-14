import React from "react"

import { Icons } from "@/components/icons"
import { Layout } from "@/components/layout"

const Bookmarks = () => {
  return (
    <Layout>
      <section className="flex h-screen flex-col items-center justify-center gap-2 ltr:border-r rtl:border-l">
        <Icons.bookmark size={80} />

        <h2 className="mt-2 text-4xl font-bold">No Bookmarks</h2>
        <p>No Bookmarks available yet, please try again later</p>
      </section>
    </Layout>
  )
}

export default Bookmarks
