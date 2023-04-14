import { FC, ReactNode } from "react"
import { DialogProps } from "@radix-ui/react-dialog"
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { useMutation } from "@tanstack/react-query"
import { Field } from "react-final-form"

import { Database } from "@/types/supabase"
import Form from "@/components/form/Form"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

type Provider =
  | "github"
  | "google"
  | "apple"
  | "twitter"
  | "linkedin"
  | "facebook"

type Props = DialogProps & { onSignInClick: () => void }
const SignUp: FC<Props> = ({ onSignInClick, ...props }) => {
  const supabaseClient = useSupabaseClient<Database>()
  const user = useUser()

  const signInWithOAuthMutation = useMutation({
    mutationFn: async (provider: Provider) =>
      await supabaseClient.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: getURL(),
        },
      }),
  })

  const signUpWithPasswordMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string
      password: string
    }) =>
      await supabaseClient.auth.signUp({
        email,
        password,
      }),
  })

  if (user) return null

  return (
    <Dialog {...props}>
      <DialogContent>
        <div>
          <h1 className="my-6 text-center text-4xl md:my-10">
            Let{`'`}s Create Your Account
          </h1>
          <div className="flex flex-col justify-center gap-4">
            {(
              [
                {
                  provider: "google",
                  text: "Continue With Google",
                  icon: <Icons.google />,
                },
                {
                  provider: "twitter",
                  icon: <Icons.twitter />,
                  text: "Continue With Twitter",
                },
                // { provider: "linkedin", text: "Continue With LinkedIn" },
                // { provider: "facebook", text: "Continue With Facebook" },
                // { provider: "apple", text: "Continue With Apple" },
              ] as {
                text: string
                icon: ReactNode
                provider: Provider
              }[]
            ).map(({ provider, text, icon }) => (
              <Button
                key={provider}
                disabled={signInWithOAuthMutation.isLoading}
                onClick={() => signInWithOAuthMutation.mutate(provider)}
                variant="outline"
                className="flex w-full gap-4"
              >
                {icon}
                {text}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <hr />
          <h1 className="text-md my-6 text-center md:my-10">
            Or Create account with email
          </h1>
          {signUpWithPasswordMutation.data?.error?.message && (
            <div className="mb-4 bg-red-50 p-4 text-center text-red-800">
              {signUpWithPasswordMutation.data?.error?.message}
            </div>
          )}
          <Form
            onSubmit={(values) =>
              signUpWithPasswordMutation.mutateAsync(values)
            }
            render={({ handleSubmit, submitting }) => (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Field
                  name="email"
                  render={({ input, meta, ...props }) => (
                    <Input
                      {...props}
                      {...input}
                      placeholder="Your email"
                      type="email"
                    />
                  )}
                />
                <Field
                  name="password"
                  render={({ input, meta, ...props }) => (
                    <Input
                      {...props}
                      {...input}
                      placeholder="Your password"
                      type="password"
                    />
                  )}
                />
                <Button disabled={submitting} type="submit">
                  Continue
                </Button>
              </form>
            )}
          />
        </div>

        <div className="my-6 text-center md:my-10">
          Already have an Account?{" "}
          <Button onClick={onSignInClick} variant="link">
            Sign in
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export type { Props as SignUpProps }
export default SignUp

const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    "http://localhost:3000/"
  // Make sure to include `https://` when not localhost.
  url = url.includes("http") ? url : `https://${url}`
  // Make sure to including trailing `/`.
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`
  return url
}
