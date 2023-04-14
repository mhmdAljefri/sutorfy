import React, { FC, useEffect, useState } from "react"
import { NextPage } from "next"
import dynamic from "next/dynamic"
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { useMutation } from "@tanstack/react-query"
import Dropzone from "react-dropzone"

import { Database } from "@/types/supabase"
import { Icons } from "@/components/icons"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const Editor = dynamic(() => import("@//components/editor"), {
  ssr: false,
})

type SupabasePosts = Database["public"]["Tables"]["posts"]

const CreatePost: FC<NextPage> = () => {
  const [postId, setPostId] = useState(null)
  const supabaseClient = useSupabaseClient<Database>()
  const [title, setTitle] = useState<string>("")
  const user = useUser()

  const createPostMutation = useMutation({
    mutationFn: (data: SupabasePosts["Insert"]) =>
      supabaseClient
        .from("posts")
        .insert(data)
        .throwOnError()
        .select("*")
        .order("id", { ascending: false })
        .single() as any,

    onSuccess: (data: any) => {
      if (data?.data?.id) {
        setPostId(data?.data?.id)
      }
    },
  })
  const updatePostMutation = useMutation({
    mutationFn: (data: SupabasePosts["Update"]) =>
      supabaseClient
        .from("posts")
        .update(data)
        .eq("id", postId)
        // .throwOnError()
        // .select()
        // .limit(1)
        .throwOnError() as any,
  })

  const handleChange = (state) => {
    if (postId)
      return updatePostMutation.mutateAsync({
        title,
        content: JSON.stringify(state),
      })

    return createPostMutation.mutateAsync({
      title,
      content: JSON.stringify(state),
      author_id: user.id,
    })
  }

  const handlePublish = () =>
    updatePostMutation.mutateAsync({ draft: false, title })

  return (
    <Layout>
      {!user ? null : (
        <div className="min-h-screen flex-1 ltr:border-r rtl:border-l">
          <div className="flex w-full items-center justify-end gap-2 p-4">
            {createPostMutation.isLoading || updatePostMutation.isLoading ? (
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
            <Editor onChange={handleChange} />
          </div>
        </div>
      )}
    </Layout>
  )
}

export default CreatePost
