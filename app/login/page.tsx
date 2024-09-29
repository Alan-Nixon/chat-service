"use client"
import React, { useEffect, useState } from 'react';
import { LoginData } from '@/interfaces/interface_types';
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import { validateEmail, validatePassword } from 'react-values-validator';
import { LoadingPage } from '../components/Loading';

function Page() {
  const { data: session, status } = useSession();
  const [loginData, setLoginData] = useState<LoginData>({ Email: "", Password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true)
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/")
    } else {
      if (status !== "loading") { setLoading(false) }
    }
  }, [session, status])

  const setValue = (key: string, value: string) => {
    setLoginData((rest) => ({ ...rest, [key]: value }))
    setError("")
  }

  const loginButton = () => {
    if (validateEmail(loginData.Email)) {
      if (validatePassword(loginData.Password)) {
        setLoading(true)
        signIn('credentials', {
          redirect: false,
          email: loginData.Email,
          password: loginData.Password,
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
        setError("Please Enter a valid Password")
      }
    } else {
      setError("Please Enter a valid Email")
    }
  }

  if (loading) { return <LoadingPage /> }

  return (
    <div className="flex w-full h-[100vh]">
      <div
        style={{ backgroundImage: "url('/images/bgLogin.jpg')" }}
        className="h-full w-full sm:w-[35%] bg-no-repeat bg-cover bg-center"
      />

      <div className="flex flex-1 justify-center items-center absolute sm:relative w-full sm:w-auto top-0 left-0 h-full bg-white sm:bg-transparent sm:p-0">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[90%] md:max-w-md sm:relative">
          <h2 className="text-3xl text-black font-bold text-center mb-6">Login</h2>
          <form>
            {error && <p className='error mb-2'>{error}</p>}
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
              type="button" onClick={() => loginButton()}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2.5 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Submit
            </button>
            <Link href="/register" className='text-blue-900 mt-2' >Doesn't have an account?</Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Page;
