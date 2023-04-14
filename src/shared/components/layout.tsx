import { ReactNode, useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { useRouter } from "next/router"
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { useMutation } from "@tanstack/react-query"
import clsx from "clsx"

import { Database } from "@/types/supabase"
import { Icons } from "./icons"
import { Button } from "./ui/button"
import Wrapper from "./ui/wrapper"

const SignIn = dynamic(() => import("@auth/components/SignIn"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
})

const SignUp = dynamic(() => import("@auth/components/SignUp"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
})

type LayoutProps = {
  children: ReactNode
  aside?: ReactNode
}

export function Layout({ children, aside }: LayoutProps) {
  const [signInFormOpen, setSignInFormOpen] = useState(false)
  const [signUpFormOpen, setSignUpFormOpen] = useState(false)

  const { push } = useRouter()
  const user = useUser()
  const supabaseClient = useSupabaseClient<Database>()

  const { mutate: signOutMutate, isLoading } = useMutation({
    mutationFn: () => supabaseClient.auth.signOut(),
  })

  return (
    <Wrapper className="relative flex">
      <div className="sticky top-0 flex h-screen min-h-screen w-96 flex-col justify-between p-4 ltr:border-r rtl:border-l">
        <div>
          <div className="flex items-center gap-3 px-4">
            <Icons.logo />
            <h1 className="text-2xl font-black">سطورفاي</h1>
          </div>

          <nav>
            <ul className="mt-20 flex flex-col gap-2">
              {[
                {
                  icon: <Icons.home />,
                  text: "الرئيسية",
                  link: "/",
                },
                {
                  icon: <Icons.draft />,
                  text: "المسودة",
                  link: "/draft",
                  hidden: !user,
                },
                {
                  icon: <Icons.bookmark />,
                  text: "الاشارات المرجعية",
                  link: "/bookmark",
                  hidden: !user,
                },
                {
                  icon: <Icons.notification />,
                  text: "الاشعارات",
                  link: "/notifications",
                  hidden: !user,
                },
                {
                  icon: <Icons.createPost />,
                  text: "إنشاء مقال",
                  link: "/posts/create",
                  hidden: !user,
                },
              ].map(({ icon, text, hidden, link, ...rest }, index) => (
                <Button
                  {...rest}
                  onClick={() =>
                    hidden ? setSignInFormOpen(true) : push(link)
                  }
                  variant="ghost"
                  key={text}
                  className={clsx(
                    "flex cursor-pointer justify-start items-center gap-2 opacity-60 hover:opacity-100",
                    { "!opacity-100": index === 0 }
                  )}
                >
                  {icon}
                  <span className="font-semibold">{text}</span>
                </Button>
              ))}

              <Button
                variant="ghost"
                className={clsx(
                  "flex justify-start cursor-pointer items-center gap-2"
                )}
                onClick={() =>
                  user ? push("/profile") : setSignInFormOpen(true)
                }
              >
                <Image
                  width={24}
                  height={24}
                  className="h-6 w-6"
                  alt="user"
                  src={`https://www.gravatar.com/avatar/00000000000000000000000000000000`}
                />
                <span className="font-semibold opacity-60 hover:opacity-100">
                  الملف الشخصي
                </span>
              </Button>
            </ul>
          </nav>
        </div>

        {user ? (
          <Button
            disabled={isLoading}
            onClick={() => signOutMutate()}
            variant="ghost"
            className="flex justify-start gap-2"
          >
            <Icons.more />
            <span>تسجيل الخروج</span>
          </Button>
        ) : (
          <Button
            disabled={isLoading}
            onClick={() => setSignInFormOpen(true)}
            variant="ghost"
            className="flex justify-start gap-2"
          >
            <Icons.more />
            <span>تسجيل الدخول</span>
          </Button>
        )}
      </div>
      <main className="w-full px-4">{children}</main>
      {aside && <div className="w-96 p-4">{aside}</div>}

      <SignIn
        onCreateAccountClick={() => {
          setSignUpFormOpen(true)
          setSignInFormOpen(false)
        }}
        open={signInFormOpen}
        onOpenChange={setSignInFormOpen}
      />
      <SignUp
        onSignInClick={() => {
          setSignInFormOpen(true)
          setSignUpFormOpen(false)
        }}
        open={signUpFormOpen}
        onOpenChange={setSignUpFormOpen}
      />
    </Wrapper>
  )
}
