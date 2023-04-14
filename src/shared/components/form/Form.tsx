import arrayMutators from "final-form-arrays"
import {
  Form as FinalForm,
  FormProps as FinalFormProps,
} from "react-final-form"
import * as z from "zod"

import { validateZodSchema } from "./validations"

export type FormProps<S extends z.ZodType<any, any>> = {
  schema?: S
  initialValues?: FinalFormProps<z.infer<S>>["initialValues"]
  mutators?: FinalFormProps<z.infer<S>>["mutators"]

  onSubmit: FinalFormProps<z.infer<S>>["onSubmit"]
  render: FinalFormProps<z.infer<S>>["render"]
  destroyOnUnregister?: FinalFormProps<z.infer<S>>["destroyOnUnregister"]
  keepDirtyOnReinitialize?: FinalFormProps<
    z.infer<S>
  >["keepDirtyOnReinitialize"]
}

export default function Form<S extends z.ZodType<any, any>>({
  schema,
  render,
  initialValues,
  onSubmit,
  destroyOnUnregister,
  keepDirtyOnReinitialize = true,
  ...props
}: FormProps<S>): JSX.Element {
  return (
    <FinalForm
      {...props}
      mutators={{
        ...arrayMutators,
        ...props.mutators,
      }}
      keepDirtyOnReinitialize={keepDirtyOnReinitialize}
      destroyOnUnregister={destroyOnUnregister}
      initialValues={initialValues}
      validate={validateZodSchema(schema)}
      onSubmit={async (...args) => {
        try {
          await onSubmit(...args)
        } catch (error: any) {
          // handle server errors
          return error?.data
        }
      }}
      render={render}
    />
  )
}
