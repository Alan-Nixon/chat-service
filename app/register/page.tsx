"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { validateEmail, validatePassword, validatePhone } from 'react-values-validator'
import { postRegister } from '../(functions)/userFunction'
import { signIn, useSession } from 'next-auth/react'
import { LoadingPage } from '../components/Loading'

function Page() {

    const { data: session, status } = useSession();
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)
    const [registerData, setRegisterData] = useState({ userName: "", Email: "", Password: "", Phone: -1 })
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.push("/")
        } else {
            if (status !== "loading") { setLoading(false) }
        }
    }, [session, status])

    const registerButton = () => {
        if (validateEmail(registerData.Email)) {
            if (validatePassword(registerData.Password)) {
                if (registerData.Phone !== -1 && validatePhone(registerData.Phone + "")) {
                    postRegister(registerData).then((data) => {
                        if (data.status) {

                            signIn('credentials', {
                                redirect: false,
                                email: data.data.Email,
                                password: registerData.Password, 
                            }).then(result => {
                                if (!result?.ok) {
                                    setLoading(false)
                                    setError("Invalid Email or Password try again")
                                } else {
                                    router.push("/")
                                    setTimeout(() => setLoading(false), 0)
                                }

                            });
                        } else {
                            setError(data.message ?? "Error occured while register")
                        }
                    })

                } else {
                    setError("Enter a valid Phone")
                }
            } else {
                setError("Enter a valid Password")
            }
        } else {
            setError("Enter a valid Email")
        }
    }

    const setValue = (key: string, value: string) => {
        setRegisterData(rest => ({ ...rest, [key]: value }));
        setError("")
    }

    if (loading) { return <LoadingPage /> }

    return (
        <div className="flex w-full h-[100vh]">
            <div
                style={{ backgroundImage: "url('/images/register.webp')" }}
                className="h-full w-full sm:w-[35%] bg-no-repeat bg-cover bg-center"
            />

            <div className="flex flex-1 justify-center items-center absolute sm:relative w-full sm:w-auto top-0 left-0 h-full bg-white sm:bg-transparent sm:p-0">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[90%] md:max-w-md sm:relative">
                    <h2 className="text-3xl text-black font-bold text-center mb-6">Register</h2>
                    <form>
                        {error && <p className='error mb-2'>{error}</p>}
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="text"
                                onChange={(e) => setValue("userName", e.target.value)}
                                name="floating_name"
                                id="floating_name"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                required
                            />
                            <label
                                htmlFor="floating_name"
                                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                Name
                            </label>
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="number"
                                onChange={(e) => setValue("Phone", e.target.value)}
                                name="floating_phone"
                                id="floating_phone"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                required
                            />
                            <label
                                htmlFor="floating_phone"
                                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                Phone
                            </label>
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="email"
                                onChange={(e) => setValue("Email", e.target.value)}
                                name="floating_email"
                                id="floating_email"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                required
                            />
                            <label
                                htmlFor="floating_email"
                                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                Email address
                            </label>
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="password"
                                name="floating_password"
                                onChange={(e) => setValue("Password", e.target.value)}
                                id="floating_password"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                required
                            />
                            <label
                                htmlFor="floating_password"
                                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                Password
                            </label>
                        </div>
                        <button
                            type="button" onClick={() => registerButton()}
                            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2.5 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                        >
                            Submit
                        </button>
                        <Link href="/login" className='text-blue-900 mt-2' >Already have an account?</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Page
