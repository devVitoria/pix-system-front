'use client'
import { api } from '@/providers/api'
import { useForm } from '@tanstack/react-form'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { GoMail } from 'react-icons/go'
import { MdPassword, MdPix } from 'react-icons/md'
import { TbEyeglassFilled, TbEyeglassOff } from 'react-icons/tb'
import ModalPixConsult from './utils/modal-pix-consult'
import { toast } from 'react-toastify'

const Login = () => {
  const [showPsd, setShowPsd] = useState(false)
  const [modalPix, setModalPix] = useState(false)
  const route = useRouter()
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async () => {
      try {
        const teste = await api.post('v1/autenticacao/login', {
          email: form.getFieldValue('email'),
          password: form.getFieldValue('password'),
        })


        localStorage.setItem('Token', teste?.data.token)
        localStorage.setItem('Nome', teste?.data.nameUser)
        localStorage.setItem('Saldo', teste?.data.saldo)
        localStorage.setItem('UserId', teste?.data.userId)
        setTimeout(() => {
          route.push('/transactions')
        }, 1000)

      } catch (error: Error | any) {
        toast.error(error.response.statusText)
      }

    },
  })

  const { Field } = form
  return (
    <div
      className="flex flex-1 justify-center items-center bg-gradient-to-r from-[#000a0e] via-[#062c38] to-[#122b36] "
      style={{ width: '100vw', height: '100vh' }}
    >
      <div
        onClick={() => {
          setModalPix(true)
        }}
        className="flex cursor-pointer flex-row items-center gap-2 absolute right-2 top-2 w-1/4 py-2 bg-white/15 border border-white/20 rounded-lg px-4 text-white placeholder-white/50 focus:border-white/30 focus:outline-none"
      >
        <MdPix size={20} />

        <p className="text-white font-bold">Consultar chave PIX</p>
      </div>
      <div className="bg-white/5 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl px-10 py-5 w-1/2">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <p className="font-bold text-white justify-center text-center text-xl w-full">
            Iniciar sessão
          </p>
          <p className=" text-white justify-center text-base text-center w-full pb-4">
            Preencha os campos abaixo para acessar a sua conta.
          </p>
          <div className="flex flex-1 justify-between items-center w-full gap-4">
            <div className="flex flex-col gap-6 w-full">
              <Field name="email">
                {(field) => (
                  <div className="flex flex-col gap-2 justify-center items-center">
                    <div className="flex flex-row gap-2 items-center w-10/12 justify-start ms-1">
                      <GoMail size={20} color='white' />

                      <label
                        htmlFor={field.name}
                        className="text-start w-10/12 text-white text-base"
                      >
                        E-mail
                      </label>
                    </div>
                    <input
                      title="email"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-10/12 bg-white/15 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:border-white/30 focus:outline-none"
                    />
                  </div>
                )}
              </Field>

              <Field name="password">
                {(field) => (
                  <div className="flex flex-col gap-2 items-center">
                    <div className="flex flex-row gap-2 items-center w-10/12 justify-start">
                      <MdPassword size={20} color='white' />

                      <label
                        htmlFor={field.name}
                        className="text-start w-10/12 text-white text-base"
                      >
                        Password
                      </label>
                    </div>

                    <input
                      type={showPsd ? 'text' : 'password'}
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-10/12 bg-white/15 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:border-white/30 focus:outline-none"
                    />

                    <div
                      className="absolute right-32 top-57 cursor-pointer hover:transition"
                      onClick={() => setShowPsd(!showPsd)}
                    >
                      {' '}
                      {showPsd ? <TbEyeglassFilled size={20} color='white' /> : <TbEyeglassOff size={20} color='white' />}
                    </div>
                  </div>
                )}
              </Field>
            </div>
          </div>
          <div className="flex w-full justify-center items-center pt-8">
            <button
              type="submit"
              className="w-1/2 cursor-pointer bg-white/15 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 font-bold focus:border-white/30 focus:outline-none"
            >
              Enviar
            </button>
          </div>
          <div onClick={() => {
            route.push('/register')
          }}>
            <p className="text-sm text-white w-full text-center pt-2 cursor-pointer">
              Não possui cadastro? <b className="underline text-sm mr-2">Crie uma conta</b>
            </p>
          </div>
        </form>
      </div>

      {modalPix && (
        <div className="absolute">
          <ModalPixConsult closeModal={() => setModalPix(false)} />{' '}
        </div>
      )}
    </div>
  )
}

export default Login

