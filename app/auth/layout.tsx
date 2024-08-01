
const AuthLayout = ({children}:{children:React.ReactNode}) => {
    return(
        <div className="flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-400 to-zinc-600">
            {children}
        </div>
    )
}

export default AuthLayout;