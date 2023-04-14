import React from "react"

import { Icons } from "@/components/icons"
import { Layout } from "@/components/layout"

const Notifications = () => {
  return (
    <Layout>
      <section className="flex h-screen flex-col items-center justify-center gap-2 ltr:border-r rtl:border-l">
        <Icons.notification size={80} />

        <h2 className="mt-2 text-4xl font-bold">No Notifications</h2>
        <p>No Notification available yet, please try again later</p>
      </section>
    </Layout>
  )
}

export default Notifications
