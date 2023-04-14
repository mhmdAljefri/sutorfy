import React from "react"
import { useUser } from "@supabase/auth-helpers-react"

import { Icons } from "@/components/icons"
import { Layout } from "@/components/layout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Profile = () => {
  const user = useUser()

  if (!user) return <Layout>loading...</Layout>

  return (
    <Layout>
      <section className="h-screen ltr:border-r rtl:border-l">
        <h1 className="pt-4 text-6xl font-bold">User Profile</h1>
        <div className="mb-4 flex gap-4 py-10">
          <Avatar className="h-14 w-14">
            <AvatarImage
              src={user.user_metadata.avatar_url}
              alt={user.user_metadata.full_name}
            />
            <AvatarFallback>
              {user.user_metadata.full_name?.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="mb-0 text-lg font-bold">
              {user.user_metadata.full_name}
            </h3>
            <p>Provider: {user.app_metadata.provider}</p>
            <p className="flex gap-2">
              {user.email}{" "}
              {user.user_metadata?.email_verified ? (
                <Icons.check className="text-green-700" />
              ) : (
                <Icons.x />
              )}
            </p>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Profile
