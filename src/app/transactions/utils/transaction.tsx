'use client'
import { api } from '@/providers/api'
import { maskCPF } from '@/providers/masks'
import { useForm } from '@tanstack/react-form'
import { SetStateAction, useEffect, useState } from 'react'
import { BsFillSendFill } from 'react-icons/bs'
import { LiaMoneyBillWaveSolid } from 'react-icons/lia'
import { toast } from 'react-toastify'

type TransactionProps = {
  chaves: {
    chave: string
    tipo: string
  }[]
  setSaldo: React.Dispatch<SetStateAction<number>>
  setChaves: React.Dispatch<
    SetStateAction<
      {
        chave: string
        tipo: string
      }[]
    >
  >
}
const Transaction = ({ setChaves, chaves, setSaldo }: TransactionProps) => {
  const [chaveOrigem, setChaveOrigem] = useState<string>()
  const [userDestiny, setUserDestiny] = useState()
  const [disableButton, setDisableButton] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm({
    defaultValues: {
      chaveDestino: '',
      valor: '',
    },
    onSubmit: async () => {
      const teste = await api.post(`/v1/transacoes`, {
        chave_origem: chaveOrigem,
        chave_destino: form.getFieldValue('chaveDestino'),
        valor: Number(form.getFieldValue('valor')),
        mensagem: 'string',
      })

      if (teste.status === 201) {
        setIsSuccess(true)
        setSaldo(teste.data.novoSaldo)
        if (localStorage?.getItem("Token") !== teste.data.token) {
          localStorage.setItem("Token", teste.data.token)
        }
      }
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      const teste = await api.get(`/v1/usuarios/${localStorage?.getItem('UserId')}/chaves`)
      setChaves(teste.data.chaves)
      setChaveOrigem(teste.data.chaves[0].chave)
      if (localStorage?.getItem("Token") !== teste.data.token) {
        localStorage.setItem("Token", teste.data.token)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (!isSuccess) return

    toast.success('Transação realizada com sucesso!')
    form.reset()
  }, [isSuccess])

  const { Field } = form
  return (
    <div className="flex flex-row w-full gap-10">
      <div>
        <p className="text-lg text-white">Efetuar transação.</p>
        <p className="text-sm text-white pb-4">
          Informe os campos necessário para prosseguir com o processo.
        </p>
        <p className="text-sm text-white pb-4">
          Selecione uma chave PIX para utilizar na transferência.
        </p>
        <select
          onChange={(e) => {
            setChaveOrigem(e.target.value)
          }}
          className="flex mb-8 cursor-pointer flex-row items-center gap-2 w-full py-2 bg-white/5 border border-white/20 rounded-lg px-4 text-white placeholder-white/50 focus:border-white/30 focus:outline-none"
        >
          {chaves?.map((item: { chave: string; tipo: string }, index: number) => (
            <option
              className="text-white bg-[#000a0e]/95 rounded-sm"
              key={index}
              value={item.chave}
            >
              {item.tipo + ' - ' + item.chave}
            </option>
          ))}
        </select>
        <p className="text-sm font-bold text-white">
          A chave definida servirá como identificador para o recebedor.
        </p>
      </div>
      <div>
        <p className="text-lg text-white w-full text-center pb-4">Dados da Transferência</p>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="gap-4 flex-col"
        >
          <div className="gap-4 flex flex-row w-full justify-center mb-4">
            <Field name="chaveDestino">
              {(field) => (
                <div className="flex flex-col gap-2 justify-center items-center">
                  <div className="flex flex-row gap-2 items-center w-10/12 justify-start ms-1">
                    <BsFillSendFill size={16} />

                    <label htmlFor={field.name} className="text-start w-10/12 text-white text-base">
                      Chave PIX de destino
                    </label>
                  </div>
                  <input
                    title="chave destino"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={async () => {
                      try {
                        const teste = await api.get(
                          `/v1/chaves/getter/${field.state.value}/${localStorage?.getItem('UserId')}`,
                        )
                        setUserDestiny(teste.data.user)
                        setDisableButton(false)
                        if (localStorage?.getItem("Token") !== teste.data.token) {
                          localStorage.setItem("Token", teste.data.token)
                        }
                      } catch (e: any) {
                        setDisableButton(true)
                        toast.error(e.response?.statusText || 'Erro inesperado')
                      }
                    }}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-10/12 bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:border-white/30 focus:outline-none"
                  />
                </div>
              )}
            </Field>

            <Field name="valor">
              {(field) => (
                <div className="flex flex-col gap-2 justify-center items-center">
                  <div className="flex flex-row gap-2 items-center w-10/12 justify-start ms-1">
                    <LiaMoneyBillWaveSolid size={20} />

                    <label htmlFor={field.name} className="text-start w-10/12 text-white text-base">
                      Valor da transação
                    </label>
                  </div>
                  <input
                    title="email"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-10/12 bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:border-white/30 focus:outline-none"
                  />
                </div>
              )}
            </Field>
          </div>
          <div className="flex justify-center items-center">
            <button
              disabled={disableButton}
              type="submit"
              className=" px-18 py-2 cursor-pointer bg-white/5 border border-white/20 rounded-lg hover:via-[#326579] hover:to-[#8ba3ad] transition-all text-white"
            >
              Autorizar operação
              <p className="text-xs">Sua senha será requisitada para finalizar o processo.</p>
            </button>
          </div>
        </form>
      </div>

      <div className="flex-1">
        <p className="text-lg text-white w-full text-center pb-4">Destinatário</p>
        <div className="gap-4 w-full">
          <div className="flex flex-col gap-2 justify-center items-center">
            <div className="w-10/12 bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:border-white/30 focus:outline-none">
              <p>
                <b className="font-bold"> Nome:</b> {userDestiny?.nome}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 justify-center items-center pt-2">
            <div className="w-10/12 bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:border-white/30 focus:outline-none">
              <p>
                <b className="font-bold"> CPF:</b> {maskCPF(userDestiny?.cpfcnpj)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Transaction
