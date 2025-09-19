import { cn } from "@/app/lib/utils";

const Segment = {
    Root({ children, className, ...rest}: React.ComponentPropsWithRef<'div'>) {
        return (
            <div
                className={cn("flex flex-col items-center w-full px-2 md:px-0", className)}
                {...rest}
            >
                { children }
            </div>
        )
    },

    Main({ children, className, ...rest}: React.ComponentPropsWithRef<'div'>) {
        return (
            <div
                className={cn(
                    "flex flex-col gap-2 w-full md:w-[920px]",
                    className
                )}
                { ...rest}
            >
                { children }
            </div>
        )
    }
}

export default Segment;