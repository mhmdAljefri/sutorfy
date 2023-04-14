import React from "react"
import { useRouter } from "next/router"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useQuery } from "@tanstack/react-query"

import { Database } from "@/types/supabase"
import Editor from "@/components/editor/Editor"
import { Layout } from "@/components/layout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Post = () => {
  const supabaseClient = useSupabaseClient<Database>()
  const {
    query: { postId },
  } = useRouter()
  const { data, isLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () =>
      await supabaseClient
        .from("posts")
        .select("*, profiles(*)")
        .eq("id", postId)
        .single()
        .throwOnError(),
  })

  if (isLoading) return <span>loading</span>

  const { title, profiles, created_at, content } = data?.data

  return (
    <Layout>
      <div className="my-10 h-96 rounded-xl bg-slate-100"></div>
      <div>
        <div className="mb-4 flex items-center justify-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage
              src={(profiles as any).avatar_url}
              alt={(profiles as any).full_name}
            />
            <AvatarFallback>
              {(profiles as any).full_name?.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="mb-0 text-lg font-bold">
              {(profiles as any).full_name}
            </h3>
            <span className="text-sm">
              {Intl.DateTimeFormat("en", {
                hour: "numeric",
                minute: "numeric",
                dayPeriod: "short",
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(new Date(created_at))}
            </span>
          </div>
        </div>
      </div>
      <h1 className="mb-6 text-center text-6xl font-bold">{title}</h1>

      <article className="prose lg:prose-xl">
        <Editor readOnly state={JSON.parse(content)} />
      </article>
    </Layout>
  )
}

export default Post
