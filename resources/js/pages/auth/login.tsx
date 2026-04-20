import { Head, useForm, Link } from "@inertiajs/react"
import React from "react"
import InputError from "@/components/input-error"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { register } from "@/routes"
import { store as loginStore } from "@/routes/login"
import { request as passwordRequest } from "@/routes/password"

type LoginProps = {
    status?: string
    canResetPassword: boolean
    canRegister: boolean
    className?: string
}

function Login({
    status,
    canResetPassword,
    canRegister,
    className,
    ...props
}: LoginProps & React.ComponentProps<"div">) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    })

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        post(loginStore() as unknown as string, {
            onFinish: () => reset("password"),
        })
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Head title="Log in" />

            <Card className="overflow-hidden p-0 bg-gray-50 shadow-lg">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form onSubmit={submit} className="p-6 md:p-8 space-y-6">
                        <FieldGroup>
                            <div className="text-center space-y-2">
                                <h1 className="text-2xl font-bold">Welcome back</h1>
                                <p className="text-muted-foreground text-sm">
                                    Enter your email and password below to log in
                                </p>
                            </div>

                            {/* Email */}
                            <Field>
                                <FieldLabel htmlFor="email">Email address</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    placeholder="email@example.com"
                                    required
                                    autoFocus
                                    autoComplete="username"
                                />
                                <InputError message={errors.email} />
                            </Field>

                            {/* Password */}
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    {canResetPassword && (
                                        <Link
                                            href={passwordRequest() as unknown as string}
                                            className="ml-auto text-sm underline hover:text-primary"
                                        >
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>

                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                    required
                                    autoComplete="current-password"
                                />
                                <InputError message={errors.password} />
                            </Field>

                            {/* Remember Me */}
                            <Field>
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData("remember", e.target.checked)
                                        }
                                    />
                                    Remember me
                                </label>
                            </Field>

                            {/* Submit */}
                            <Field>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={processing}
                                >
                                    {processing && (
                                        <Spinner className="mr-2 h-4 w-4" />
                                    )}
                                    Login
                                </Button>
                            </Field>

                            <FieldSeparator className="text-xs uppercase">
                                Or continue with
                            </FieldSeparator>


                            {canRegister && (
                                <p className="text-center text-sm text-muted-foreground">
                                    Don't have an account?{" "}
                                    <Link
                                        href={register()}
                                        className="underline hover:text-primary"
                                    >
                                        Sign up
                                    </Link>
                                </p>
                            )}

                            {status && (
                                <div className="text-center text-sm font-medium text-green-600">
                                    {status}
                                </div>
                            )}
                        </FieldGroup>
                    </form>

                    {/* Image Section */}
                    <div className="bg-muted relative hidden md:block">
                        <img
                            src="images/Perpustakaan Kampus.jpg"
                            alt="Login Image"
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* <p className="text-center text-sm text-muted-foreground px-8">
                By clicking continue, you agree to our{" "}
                <a href="#" className="underline hover:text-primary">
                    Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="underline hover:text-primary">
                    Privacy Policy
                </a>
            </p> */}
        </div>
    )
}

/* =========================
   PAGE WRAPPER (DEFAULT)
========================= */

export default function LoginPage({
    status,
    canResetPassword,
    canRegister,
}: {
    status?: string
    canResetPassword: boolean
    canRegister: boolean
}) {
    return (
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-4xl">
                <Login
                    status={status}
                    canResetPassword={canResetPassword}
                    canRegister={canRegister}
                />
            </div>
        </div>
    )
}