import Link from "next/link"
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { useQuery } from "@tanstack/react-query"

import { Database } from "@/types/supabase"
import { Icons } from "@/components/icons"
import { Layout } from "@/components/layout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function IndexPage() {
  const supabaseClient = useSupabaseClient<Database>()
  const user = useUser()

  /**
   * @todo add pagination
   */
  const { data, isSuccess } = useQuery({
    queryKey: ["posts"],
    queryFn: async () =>
      await supabaseClient
        .from("posts")
        .select(
          `*,
            profiles (
              id,
              full_name,
              avatar_url
            )
      `
        )
        .eq("draft", true)
        .eq("author_id", user.id)
        .range(0, 13)
        .throwOnError(),
  })

  if (isSuccess && data?.data?.length === 0) {
    return (
      <Layout>
        <section className="flex h-screen flex-col items-center justify-center gap-2">
          <Icons.draft size={80} />
          <h2 className="mt-2 text-4xl font-bold">No Draft</h2>
          <p>No draft posts available yet, please try again later</p>
        </section>
      </Layout>
    )
  }

  return (
    <Layout>
      <section className="min-h-screen ltr:border-r rtl:border-l">
        {data?.data?.map(({ id, title, profiles, content, created_at }) => {
          const paragraph = joinText(JSON.parse(content).root)
          return (
            <div className="grid gap-4 border-b p-4 md:grid-cols-3">
              <div className="col-span-2">
                <div className="mb-4 flex items-center gap-4">
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
                <div>
                  <Link passHref href={`/posts/update/${id}`}>
                    <h2 className="text-4xl font-bold">{title}</h2>
                  </Link>
                  <div className="my-2 flex gap-2">
                    <Icons.book />
                    <span>{calculateReadingTime(paragraph)} min read</span>
                  </div>
                  <p className="line-clamp-3">{paragraph.slice(0, 400)}</p>
                </div>
              </div>

              <div className="my-6 h-48 rounded-lg bg-slate-100"></div>
            </div>
          )
        })}
      </section>
    </Layout>
  )
}

function calculateReadingTime(text) {
  const wordsPerMinute = 200 // Average reading speed is 200 words per minute
  const words = text.split(" ").length
  const minutes = words / wordsPerMinute
  const readingTime = Math.ceil(minutes)

  return readingTime
}

function joinText(obj) {
  let result = ""
  if (obj.children) {
    obj.children.forEach((child) => {
      result += joinText(child)
    })
  }
  if (obj.text) {
    result += obj.text
  }
  return result
}
