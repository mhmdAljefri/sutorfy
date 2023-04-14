import React, { FC, useEffect, useState } from "react"
import { NextPage } from "next"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { useMutation, useQuery } from "@tanstack/react-query"
import Dropzone from "react-dropzone"

import { Database } from "@/types/supabase"
import { Icons } from "@/components/icons"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const Editor = dynamic(() => import("@//components/editor"), {
  ssr: false,
})

type SupabasePosts = Database["public"]["Tables"]["posts"]

const UpdatePost: FC<NextPage> = () => {
  const supabaseClient = useSupabaseClient<Database>()
  const {
    query: { postId },
  } = useRouter()
  const user = useUser()

  const [title, setTitle] = useState<string>("")
  const [content, setContent] = useState(null)

  const handleState = (data) => {
    if (!data) return
    setTitle(data.title)
    setContent(JSON.stringify(data.content))
  }

  const { isLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () =>
      await supabaseClient
        .from("posts")
        .select("*, profiles(*)")
        .eq("id", postId)
        .single()
        .throwOnError(),
    enabled: !!postId,
    onSuccess: ({ data }) => {
      handleState(data)
    },
  })

  const updatePostMutation = useMutation({
    mutationFn: (values: SupabasePosts["Update"]) =>
      supabaseClient
        .from("posts")
        .update(values)
        .eq("id", postId)
        // .throwOnError()
        // .select()
        // .limit(1)
        .single()
        .throwOnError() as any,
    onSuccess: (data: any) => handleState(data?.data),
  })

  const handleChange = (state) => {
    if (!content) return
    return updatePostMutation.mutateAsync({
      title,
      content: JSON.stringify(state),
    })
  }

  const handlePublish = () =>
    updatePostMutation.mutateAsync({ draft: false, title })

  if (isLoading) return <span>loading</span>

  return (
    <Layout>
      {!user ? null : (
        <div className="flex-1 ltr:border-r rtl:border-l rtl:border-l-slate-200 dark:border-r-slate-700">
          <div className="flex w-full items-center justify-end gap-2 p-4">
            {updatePostMutation.isLoading ? (
              <span className="px-4">Saving...</span>
            ) : null}
            <Button variant="subtle">Preview</Button>
            <Button onClick={handlePublish}>Publish</Button>
          </div>

          <div className="p-4">
            <Dropzone multiple={false} onDrop={(files) => console.log(files)}>
              {({ getRootProps, getInputProps }) => (
                <div className="container">
                  <div
                    {...getRootProps({
                      className: "dropzone",
                      onDrop: (event) => event.stopPropagation(),
                    })}
                  >
                    <input {...getInputProps()} />
                    <Button variant="ghost" className="flex gap-2">
                      <Icons.image />
                      Add Cover
                    </Button>
                  </div>
                </div>
              )}
            </Dropzone>
            <Textarea
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              className="my-8 !block !h-14 !w-full !border-0 text-4xl font-bold !ring-0"
            />
            <Editor state={JSON.parse(content)} onChange={handleChange} />
          </div>
        </div>
      )}
    </Layout>
  )
}

export default UpdatePost
