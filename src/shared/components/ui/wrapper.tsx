import React from "react"
import clsx from "clsx"

type Props = React.ComponentPropsWithoutRef<"div">
const Wrapper: React.FC<Props> = ({ className, children, ...props }) => {
  return (
    <div {...props} className={clsx(className, "mx-auto container")}>
      {children}
    </div>
  )
}

export default Wrapper
