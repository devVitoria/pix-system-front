'use client'

import Done from '@/assets/done'
import { api } from '@/providers/api'
import { useForm } from '@tanstack/react-form'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import { maskCep, maskCPF, maskPhone } from '@/providers/masks'
import { TbEyeglassFilled, TbEyeglassOff } from 'react-icons/tb'

const Register = () => {
  const [isSuccess, setIsSuccess] = useState(false)
  const [cepData, setCepData] = useState('')
  const router = useRouter()
  const [showPsd, setShowPsd] = useState(false)

  const form = useForm({
    defaultValues: {
      cpfcnpj: '',
      nome: '',
      telefone: '',
      rua: '',
      bairro: '',
      cidade: '',
      email: '',
      password: '',
      nroConta: '',
      cep: '',
    },
    onSubmit: async () => {
      const verify = await api.post(`v1/usuarios/verify-data`, {
        cpfcnpj: form.getFieldValue('cpfcnpj'),
        nome: form.getFieldValue('nome'),
        bairro: form.getFieldValue('bairro'),
        rua: form.getFieldValue('rua'),
        telefone: form.getFieldValue('telefone'),
        cidade: form.getFieldValue('cidade'),
        email: form.getFieldValue('email'),
        password: form.getFieldValue('password'),
        conta: {
          nroConta: form.getFieldValue('nroConta'),
          saldo: 0,
        },
      })
      if (verify.data.exists) {
        const numberOfMessages = verify.data.message?.length
        const message = verify.data.message
        if (numberOfMessages > 1) {
          message.splice(numberOfMessages - 1, 0, 'e')
        }
        let formattedMessage = ''
        for (const mg of message) {
          const nextIndex = message.indexOf(mg) + 1
          const idx = message.indexOf(mg)
          formattedMessage +=
            message[nextIndex] === 'e'
              ? ` ${mg} `
              : mg === 'e'
                ? ` ${mg} `
                : idx === message.length - 1
                  ? ` ${mg} `
                  : `${mg}, `
        }
        toast.error(
          `${numberOfMessages > 1 ? 'Os campos' : 'O campo'} ${formattedMessage} já est${numberOfMessages > 1 ? 'ão' : 'á'} em uso por outro usuário!`,
        )
        return
      }

      const teste = await api.post('v1/usuarios', {
        cpfcnpj: form.getFieldValue('cpfcnpj'),
        nome: form.getFieldValue('nome'),
        bairro: form.getFieldValue('bairro'),
        rua: form.getFieldValue('rua'),
        telefone: form.getFieldValue('telefone'),
        cidade: form.getFieldValue('cidade'),
        email: form.getFieldValue('email'),
        password: form.getFieldValue('password'),
        conta: {
          nroConta: form.getFieldValue('nroConta'),
          saldo: 0,
        },
      })
      if (teste.statusText === 'Created') {
        setIsSuccess(true)
      }
    },
  })

  const { Field } = form

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        router.push('/login')
      }, 6000)
    }
  }, [isSuccess])

  useEffect(() => {
    const cepInfo = async () => {
      if (cepData.length === 8) {
        const dadosCep = await api.get(`https://brasilapi.com.br/api/cep/v1/${cepData}`)
        form.setFieldValue('rua', dadosCep.data.street)
        form.setFieldValue('bairro', dadosCep.data.neighborhood)
        form.setFieldValue('cidade', dadosCep.data.city)
      }
    }
    cepInfo()
  }, [cepData])

  return isSuccess ? (
    <div
      className="flex flex-1 flex-col gap-12 justify-center items-center  bg-gradient-to-r from-[#000a0e] via-[#062c38] to-[#122b36] "
      style={{ width: '100vw', height: '100vh' }}
    >
      <p className=" text-white justify-center w-full text-center font-bold">Seu cadastro foi registrado!</p>
      <Done></Done>
      <p className="text-white justify-center w-full text-center font-bold">
        Em instantes você será redirecionado para a página de{' '}
        <b className="font-bold text-white">Login</b>.
      </p>
    </div>
  ) : (
    <div
      className="flex flex-1 justify-center items-center bg-gradient-to-r from-[#000a0e] via-[#062c38] to-[#122b36] "
      style={{ width: '100vw', height: '100vh' }}
    >
      <div className="bg-white/5 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl px-10 py-5 w-10/12 items-center justify-between">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <p className="font-bold text-white justify-center text-center text-xl w-full">
            Cadastro de usuários
          </p>
          <p className=" text-white justify-center text-base text-center w-full pb-4">
            Preencha os campos abaixo para registrar a sua conta.
          </p>
          <div className="flex flex-row w-full justify-between gap-4">
            <div className="flex flex-col gap-2 w-1/2">
              <Field name="cpfcnpj">
                {(field) => (
                  <div className="flex flex-col gap-2 py-2">
                    <label htmlFor={field.name} className="font-bold text-white text-base">
                      CPF:
                    </label>
                    <input
                      id={field.name}
                      maxLength={11}
                      name={field.name}
                      value={maskCPF(field.state.value)}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className=" bg-white/15 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:border-white/30 focus:outline-none"
                    />
                    {field.state.meta.errors && (
                      <span className="text-red-400 text-sm">
                        {field.state.meta.errors.join(', ')}
                      </span>
                    )}
                  </div>
                )}
              </Field>

              <Field name="nome">
                {(field) => (
                  <div className="flex flex-col gap-2">
                    <label htmlFor={field.name} className="font-bold text-white text-base">
                      Nome:
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className=" bg-white/15 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:border-white/30 focus:outline-none"
                    />
                  </div>
                )}
              </Field>

              <Field name="telefone">
                {(field) => (
                  <div className="flex flex-col gap-2">
                    <label htmlFor={field.name} className="font-bold text-white text-base">
                      Telefone:
                    </label>
                    <input
                      id={field.name}
                      maxLength={11}
                      name={field.name}
                      value={maskPhone(field.state.value)}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className=" bg-white/15 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:border-white/30 focus:outline-none"
                    />
                  </div>
                )}
              </Field>

              <Field name="cep">
                {(field) => (
                  <div className="flex flex-col gap-2">
                    <label htmlFor={field.name} className="font-bold text-white text-base">
                      CEP:
                    </label>
                    <input
                      id={field.name}
                      maxLength={8}
                      name={field.name}
                      value={maskCep(field.state.value)}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value)
                        setCepData(e.target.value)
                      }}
                      className=" bg-white/15 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:border-white/30 focus:outline-none"
                    />
                  </div>
                )}
              </Field>

              <Field name="rua">
                {(field) => (
                  <div className="flex flex-col gap-2">
                    <label htmlFor={field.name} className="font-bold text-white text-base">
                      Rua:
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className=" bg-white/15 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:border-white/30 focus:outline-none"
                    />
                  </div>
                )}
              </Field>

              <Field name="bairro">
                {(field) => (
                  <div className="flex flex-col gap-2 flex-1">
                    <label htmlFor={field.name} className="font-bold text-white text-base">
                      Bairro:
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className=" bg-white/15 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:border-white/30 focus:outline-none"
                    />
                  </div>
                )}
              </Field>
            </div>

            <div className="flex flex-col gap-2 w-1/2">
              <Field name="cidade">
                {(field) => (
                  <div className="flex flex-col gap-2 py-2">
                    <label htmlFor={field.name} className="font-bold text-white text-base">
                      Cidade:
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className=" bg-white/15 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:border-white/30 focus:outline-none"
                    />
                  </div>
                )}
              </Field>

              <Field name="email">
                {(field) => (
                  <div className="flex flex-col gap-2">
                    <label htmlFor={field.name} className="font-bold text-white text-base">
                      E-mail:
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className=" bg-white/15 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:border-white/30 focus:outline-none"
                    />
                  </div>
                )}
              </Field>

              <Field name="password">
                {(field) => (
                  <div className="flex flex-col gap-2">
                    <label htmlFor={field.name} className="font-bold text-white text-base">
                      Password:
                    </label>
                    <input
                      id={field.name}
                      type={showPsd ? 'text' : 'password'}
                      maxLength={6}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className=" bg-white/15 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:border-white/30 focus:outline-none"
                    />
                  </div>
                )}
              </Field>

              <div
                className="absolute right-16 top-78 cursor-pointer hover:transition"
                onClick={() => setShowPsd(!showPsd)}
              >
                {' '}
                {showPsd ? (
                  <TbEyeglassFilled size={20} color="white" />
                ) : (
                  <TbEyeglassOff size={20} color="white" />
                )}
              </div>

              <Field name="nroConta">
                {(field) => (
                  <div className="flex flex-col gap-2">
                    <label htmlFor={field.name} className="font-bold text-white text-base">
                      Número da conta:
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="bg-white/15 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:border-white/30 focus:outline-none"
                    />
                  </div>
                )}
              </Field>
            </div>
          </div>
          <div className="flex w-full flex-row justify-end  gap-4 items-end">
            <button
              type="button"
              className=" cursor-pointer bg-white/15 border border-blue/20 rounded-lg px-4 py-2 text-white placeholder-white/50 font-bold focus:border-white/30 focus:outline-none"
            >
              Limpar
            </button>
            <button
              type="submit"
              className=" cursor-pointer bg-[#062c38]/50 border border-blue/20 rounded-lg px-4 py-2 text-white placeholder-white/50 font-bold focus:border-white/30 focus:outline-none"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
