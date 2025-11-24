'use client'
import { api } from '@/providers/api'
import { useForm } from '@tanstack/react-form'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BsCoin, BsPencilSquare } from 'react-icons/bs'
import { FaHistory, FaUserCircle } from 'react-icons/fa'
import { MdDelete, MdOutlineLogout, MdPix } from 'react-icons/md'
import { TfiKey } from 'react-icons/tfi'
import Transaction from './utils/transaction'
import PixkeyRegister from './utils/pix-key-register'
import Deposit from './utils/deposit'
import { TransactionProps, UserInfoProps } from './utils/interface'
import { toast } from 'react-toastify'
import { BiSearchAlt } from 'react-icons/bi'
import ModalPixConsult from '../login/utils/modal-pix-consult'
import { IoPlayBack } from 'react-icons/io5'
import { TbPlayerTrackNextFilled } from 'react-icons/tb'
import TransactionHistory from './utils/transaction-history'

const Transactions = () => {
  const [operation, setOperation] = useState<'transactions' | 'history' | 'chavepix' | 'deposite'>(
    'transactions',
  )

  // const [saldo, setSaldo] = useState<number>(Number(localStorage?.getItem('Saldo')) ?? 0)
  // TODO: ajustar saldo global com localStorage
  const [saldo, setSaldo] = useState<number>(0)
  const [chaves, setChaves] = useState<{ chave: string; tipo: string }[]>([])
  const [user, setUser] = useState<UserInfoProps>()
  const [searchData, setSearchData] = useState<{ open: boolean | null, data: string | null }>({ open: null, data: 'user' })
  const [openUser, setOpenUser] = useState<boolean | null>(null)
  const [usersInfo, setUsersInfo] = useState<UserInfoProps[]>()
  const [modalPix, setModalPix] = useState(false)
  const [transactionsInfo, setTransactionsInfo] = useState<TransactionProps[]>()
  const [pageNumberUser, setPageNumberUser] = useState<number>(1)
  const [totalPageUser, setTotalPageUser] = useState<number | null>(null)
  const [totalPageTransactios, setTotalPageTransactions] = useState<number | null>(null)


  const [pageNumberTransactions, setPageNumberTransactions] = useState<number>(1)

  const router = useRouter()
  const form = useForm({
    defaultValues: user,
    onSubmit: async () => {
      const teste = await api.patch(`http://localhost:4000/v1/usuarios/${localStorage.getItem('UserId')}`, {
        cpfcnpj: form.getFieldValue('cpfcnpj'),
        nome: form.getFieldValue('nome'),
        bairro: form.getFieldValue('bairro'),
        rua: form.getFieldValue('rua'),
        telefone: form.getFieldValue('telefone'),
        cidade: form.getFieldValue('cidade'),
        email: form.getFieldValue('email'),

      })

      if (teste.status === 200) {
        setOpenUser(false)
        if (localStorage.getItem("Token") !== teste.data.token) {
          localStorage.setItem("Token", teste.data.token)
        }
        toast.success('Dados atualizados com sucesso!')
      } else {
        toast.error('Erro ao atualizar dados. Tente novamente.')
      }


    },
  })

  useEffect(() => {
    const getInfos = async () => {
      const teste = await api.get(`/v1/usuarios/pagination/${pageNumberUser}`)
      setUsersInfo(teste.data.usuarios)
      setTotalPageUser(teste.data.totalPages)
      const teste2 = await api.get(`/v1/transacoes/pagination/${pageNumberTransactions}`)
      setTotalPageTransactions(teste2.data.totalPages)
      setTransactionsInfo(teste2.data.transacoes)


      if (localStorage.getItem("Token") !== teste.data.token) {
        localStorage.setItem("Token", teste.data.token)
      }
    }

    getInfos()

  }, [searchData.open])


  const handleChangePage = (type: string, operation?: string) => {

    if (operation === 'tsr') {

      if (type === 'next') {
        if (pageNumberTransactions !== totalPageTransactios) {
          setPageNumberUser(pageNumberTransactions + 1)
          return
        }
      }

      if (pageNumberTransactions > 1) {
        setPageNumberUser(pageNumberTransactions - 1)
        return
      }
      return
    }
    if (type === 'next') {
      if (pageNumberUser !== totalPageUser) {
        setPageNumberUser(pageNumberUser + 1)
        return
      }
    }

    if (pageNumberUser > 1) {
      setPageNumberUser(pageNumberUser - 1)
      return
    }
  }

  const renderScreen: Record<string, React.ReactNode> = {
    transactions: <Transaction setChaves={setChaves} chaves={chaves} setSaldo={setSaldo} />,
    history: <TransactionHistory userId='' />, // TODO chsange to component
    chavepix: <PixkeyRegister />,
    deposite: <Deposit setSaldo={setSaldo} />,
  }

  useEffect(() => {
    const getUser = async () => {
      const teste = await api.get<UserInfoProps>(`v1/usuarios/${localStorage.getItem('UserId')}`)
      setUser(teste.data?.usuario)
      if (localStorage.getItem("Token") !== teste?.data?.token) {
        localStorage.setItem("Token", teste?.data?.token ?? '')
      }
    }
    getUser()

  }, [openUser])

  const handleDeleteAccount = async () => {
    const response = await api.delete(`http://localhost:4000/v1/usuarios/${localStorage.getItem('UserId')}`)
    if (response.status === 200) {
      localStorage.clear()
      router.push('/login')
    }
    else {
      toast.error('Erro ao deletar conta. Tente novamente.')
    }
  }

  const { Field } = form


  useEffect(() => {
    if (user) {
      form.reset(user)
    }
  }, [user])




  return (
    <div
      className="flex flex-1  min-h-screen  flex-col bg-gradient-to-r from-[#000a0e] via-[#062c38] to-[#122b36]"
      style={{ width: '100vw' }}
    >
      <header
        className="bg-white/5 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl m-2 py-2
      "
      >
        <div className="flex flex-row px-10 py-3 w-full justify-between items-center">
          <div className="flex flex-col">
            <p className="text-lg text-white">
              {/* Bem vindo, {localStorage.getItem('Nome')?.trim().split(' ')[0]}! */}
              Bem Vindo ..
            </p>
            <p className="text-sm text-white">Navegue entre as opções abaixo.</p>
          </div>
          <div className="flex flex-row items-center gap-8">
            <div className="flex flex-col">
              <p className="text-lg text-white">R$ {saldo}</p>
              <p className="text-sm text-white text-end">seu saldo</p>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <FaUserCircle
                color="white"
                size={30}
                className='cursor-pointer'
                onClick={() => {
                  setOpenUser(!openUser)
                }}
              />
              <BiSearchAlt color="white"
                className='cursor-pointer'

                size={30}
                onClick={() => {
                  setSearchData(searchData.open ? { open: false, data: 'user' } : { open: true, data: 'user' })
                }} />

            </div>


          </div>
        </div>
      </header>
      <div className="flex flex-row justify-center items-center w-full pb-10 pt-8">
        <div className="w-full mx-2 rounded-lg bg-white/5 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl m-2 py-2 shadow-sm border border-b-white/10 border-t-white/10 border-transparent  flex justify-center items-center">
          <p className="text-white text-lg font-bold py-2 text-center">Ações para a sua conta</p>
        </div>
      </div>
      {openUser && (
        <div className="absolute z-50 bg-white/5 backdrop-blur-lg border border-white/20 shadow-xl right-10 top-20 w-1/3 rounded-sm p-4">
          <p className="text-white font-bold text-center pb-4">Dados da sua conta</p>
          <div className="bg-[#000a0e]/25 flex-col p-4 gap-4 flex">
            <div className=' max-h-80 overflow-auto gap-4 flex flex-col'>
              <div className='flex flex-row justify-between items-center w-full' key={user?.id}>
                <Field name="cpfcnpj">
                  {(field) => (
                    <div className="flex flex-1 flex-col gap-2 justify-center items-center">
                      <div className="flex flex-row gap-2 items-center w-10/12 justify-start ms-1">

                        <label htmlFor={field.name} className="text-xs text-white font-bold">
                          <b>CPF</b>
                        </label>
                      </div>
                      <input
                        title="cpfcnpj"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-10/12 bg-white/5 border border-white/20 rounded-lg px-4  text-white placeholder-white/50 focus:border-white/30 focus:outline-none py-1"
                      />
                    </div>
                  )}
                </Field>

              </div>


              <div className='flex  flex-row justify-between items-center w-full'>

                <Field name="nome">
                  {(field) => (
                    <div className="flex flex-1  flex-col gap-2 justify-center items-center">
                      <div className="flex flex-row gap-2 items-center w-10/12 justify-start ms-1">

                        <label htmlFor={field.name} className="text-xs text-white font-bold">
                          <b>Nome</b>
                        </label>
                      </div>
                      <input
                        title="cpfcnpj"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-10/12 bg-white/5 border border-white/20 rounded-lg px-4  text-white placeholder-white/50 focus:border-white/30 focus:outline-none py-1"
                      />
                    </div>

                  )}
                </Field>

              </div>

              <div className='flex flex-row justify-between items-center w-full'>

                <Field name="telefone">
                  {(field) => (
                    <div className="flex flex-1  flex-col gap-2 justify-center items-center">
                      <div className="flex flex-row gap-2 items-center w-10/12 justify-start ms-1">

                        <label htmlFor={field.name} className="text-xs text-white font-bold">
                          <b>Telefone</b>
                        </label>
                      </div>
                      <input
                        title="cpfcnpj"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-10/12 bg-white/5 border border-white/20 rounded-lg px-4  text-white placeholder-white/50 focus:border-white/30 focus:outline-none py-1"
                      />
                    </div>
                  )}
                </Field>

              </div>

              <div className='flex flex-row justify-between items-center w-full'>

                <Field name="email">
                  {(field) => (
                    <div className="flex  flex-1  flex-col gap-2 justify-center items-center">
                      <div className="flex flex-row gap-2 items-center w-10/12 justify-start ms-1">

                        <label htmlFor={field.name} className="text-xs text-white font-bold">
                          <b>E-mail</b>
                        </label>
                      </div>
                      <input
                        title="cpfcnpj"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-10/12 bg-white/5 border border-white/20 rounded-lg px-4  text-white placeholder-white/50 focus:border-white/30 focus:outline-none py-1"
                      />
                    </div>
                  )}
                </Field>

              </div>

              <div className='flex flex-row justify-between items-center w-full'>

                <Field name="bairro">
                  {(field) => (
                    <div className="flex flex-1  flex-col gap-2 justify-center items-center">
                      <div className="flex flex-row gap-2 items-center w-10/12 justify-start ms-1">

                        <label htmlFor={field.name} className="text-xs text-white font-bold">
                          <b>Bairro</b>
                        </label>
                      </div>
                      <input
                        title="cpfcnpj"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-10/12 bg-white/5 border border-white/20 rounded-lg px-4  text-white placeholder-white/50 focus:border-white/30 focus:outline-none py-1"
                      />
                    </div>
                  )}
                </Field>

              </div>
              <div className='flex  flex-row justify-between items-center w-full'>

                <Field name="cidade">
                  {(field) => (
                    <div className="flex flex-1  flex-col gap-2 justify-center items-center">
                      <div className="flex flex-row gap-2 items-center w-10/12 justify-start ms-1">

                        <label htmlFor={field.name} className="text-xs text-white font-bold">
                          <b>Cidade</b>
                        </label>
                      </div>
                      <input
                        title="cpfcnpj"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-10/12 bg-white/5 border border-white/20 rounded-lg px-4  text-white placeholder-white/50 focus:border-white/30 focus:outline-none py-1"
                      />
                    </div>
                  )}
                </Field>

              </div>
              <div className='flex flex-row justify-between items-center w-full'>

                <Field name="rua">
                  {(field) => (
                    <div className="flex flex-1  flex-col gap-2 justify-center items-center">
                      <div className="flex flex-row gap-2 items-center w-10/12 justify-start ms-1">

                        <label htmlFor={field.name} className="text-xs text-white font-bold">
                          <b>Rua</b>
                        </label>
                      </div>
                      <input
                        title="cpfcnpj"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-10/12 bg-white/5 border border-white/20 rounded-lg px-4  text-white placeholder-white/50 focus:border-white/30 focus:outline-none py-1"
                      />
                    </div>
                  )}
                </Field>


              </div>
            </div>
            <div className='flex flex-row gap-4 items-center w-full justify-between ' onClick={() => {
              form.handleSubmit()
            }}>
              <label className="text-xs text-white font-bold">
                <b>Salvar alterações</b>
                <p className='text-xs text-white font-extralight'>Isso alterará suas informações cadastrais.</p>
              </label>

              <BsPencilSquare size={18} className='mr-10' />
            </div>


            <div className='flex flex-row gap-4 items-center w-full justify-between ' onClick={() => {
              localStorage.clear()
              router.push('/login')
            }}>
              <label className="text-xs text-white font-bold">
                <b>Sair</b>
                <p className='text-xs text-white font-extralight'>Deslogar sua conta.</p>
              </label>

              <MdOutlineLogout size={18} className='mr-10' />
            </div>

            <div className='flex flex-row gap-4 items-center w-full justify-between ' onClick={() => {
              handleDeleteAccount()
            }}>
              <label className="text-xs text-white font-bold">
                <b>Deletar conta</b>
                <p className='text-xs text-white font-extralight'>Sua conta será permanentemente excluída.</p>
              </label>

              <MdDelete size={18} className='mr-10' />
            </div>
          </div>
        </div>
      )
      }

      {searchData.open && (
        <div className="absolute w-10/12 z-10 bg-white/5 backdrop-blur-lg border border-white/20 shadow-xl top-1/5 left-1/12 rounded-sm p-4">
          <p className="text-white font-bold text-center pb-4">Buscar dados {searchData.data === 'trs'}</p>
          <div className='flex flex-row justify-around items-center'>
            <p className="text-white text-sm text-center pb-4 hover:text-[15px] hover:font-bold" onClick={() => setSearchData((prev) => ({
              ...prev,
              data: 'user',
            }))}>Usuários</p>
            <p className="text-white text-sm text-center pb-4 hover:text-[15px] hover:font-bold" onClick={() => setSearchData((prev) => ({
              ...prev,
              data: 'trs',
            }))}>Transações</p>
          </div>
          <div className="bg-[#000a0e]/25 flex-col  p-4 gap-4 flex">
            <div key={searchData.data} className=' max-h-80 overflow-auto gap-4 flex flex-col'>

              {

                searchData.data === 'user' ? (
                  <>
                    <div className='flex flex-row justify-between items-center'>
                      <p className='font-bold text-sm text-center w-[20%] max-w-[20%] '>CPF</p>
                      <p className='font-bold text-sm text-center w-[20%] max-w-[20%]'>Nome</p>
                      <p className='font-bold text-sm text-center w-[20%] max-w-[20%]'>E-mail</p>
                      <p className='font-bold text-sm text-center w-[20%] max-w-[20%]'>Telefone</p>
                      <p className='font-bold text-sm text-center w-[20%] max-w-[20%]'>Endereço</p>

                    </div>
                    <div className='w-full h-[0.2px] my-2 bg-white opacity-40' />
                    {
                      usersInfo?.map((i) => {
                        return (
                          <div key={i.id + 'a'} className='flex flex-col'>
                            <div className='flex flex-row justify-between items-center'>
                              <p className='text-xs text-center w-[20%] max-w-[20%]'>{i.cpfcnpj}</p>
                              <p className='text-xs text-center w-[20%] max-w-[20%]'>{i.nome}</p>
                              <p className='text-xs text-center w-[20%] max-w-[20%]'>{i.email}</p>
                              < p className='text-xs text-center w-[20%] max-w-[20%]'>{i.telefone}</p>
                              < p className='text-xs text-center w-[20%] max-w-[20%]'>{i.cidade} - {i.bairro} - {i.rua}</p>
                            </div>
                            <div className='w-full h-[0.2px] my-4 bg-white opacity-20' />                      </div>
                        )

                      })
                    }

                    <div className="flex flex-row gap-2 pt-1 w-full justify-end items-center">
                      <IoPlayBack color={pageNumberUser === 1 ? "#859094" : "#326579"} className="cursor-pointer" onClick={() => { handleChangePage('back') }} />

                      <div className="w-6 h-4 rounded-sm bg-[#326579] flex justify-center items-center">
                        <p className="text-xs">{pageNumberUser}</p>
                      </div>
                      <p className="text-[#326579] font-bold">...</p>
                      <div className="w-6 h-4  rounded-sm bg-[#326579] flex justify-center items-center">
                        <p className="text-xs">{totalPageUser}</p>
                      </div>
                      <TbPlayerTrackNextFilled color={pageNumberUser === totalPageUser ? "#859094" : "#326579"} className="cursor-pointer" onClick={() => { handleChangePage('next') }} />
                    </div>
                  </>


                ) : (
                  <>
                    <div className='flex flex-row justify-between items-center'>
                      <p className='font-bold text-sm text-center w-[20%] max-w-[20%] '>ORIGEM</p>
                      <p className='font-bold text-sm text-center w-[20%] max-w-[20%]'>DESTINO</p>
                      <p className='font-bold text-sm text-center w-[20%] max-w-[20%]'>VALOR</p>
                      <p className='font-bold text-sm text-center w-[20%] max-w-[20%]'>DATA</p>
                      <p className='font-bold text-sm text-center w-[20%] max-w-[20%]'>ID</p>

                    </div>
                    <div className='w-full h-[0.2px] my-2 bg-white opacity-40' />
                    {
                      transactionsInfo?.map((i) => {
                        return (
                          <div key={i?.transacao?.id + 'avar'} className='flex flex-col'>
                            <div className='flex flex-row justify-between items-center'>
                              <p className='text-xs text-center w-[20%] max-w-[20%] text-white'>{i?.chave_origem?.chave}</p>
                              <p className='text-xs text-center w-[20%] max-w-[20%]'>{i?.chave_destino.chave}</p>
                              <p className='text-xs text-center w-[20%] max-w-[20%]'>{i?.valor}</p>
                              < p className='text-xs text-center w-[20%] max-w-[20%]'>{i?.data_transferencia}</p>
                              < p className='text-xs text-center w-[20%] max-w-[20%]'>{i?.id}</p>
                            </div>
                            <div className='w-full h-[0.2px] my-4 bg-white opacity-20' />                      </div>
                        )

                      })
                    }

                    <div className="flex flex-row gap-2 pt-1 w-full justify-end items-center">
                      <IoPlayBack color={pageNumberTransactions === 1 ? "#859094" : "#326579"} className="cursor-pointer" onClick={() => { handleChangePage('back', 'tsr') }} />

                      <div className="w-6 h-4 rounded-sm bg-[#326579] flex justify-center items-center">
                        <p className="text-xs">{pageNumberTransactions}</p>
                      </div>
                      <p className="text-[#326579] font-bold">...</p>
                      <div className="w-6 h-4  rounded-sm bg-[#326579] flex justify-center items-center">
                        <p className="text-xs">{totalPageTransactios}</p>
                      </div>
                      <TbPlayerTrackNextFilled color={pageNumberTransactions === totalPageTransactios ? "#859094" : "#326579"} className="cursor-pointer" onClick={() => { handleChangePage('next', 'tsr') }} />
                    </div>
                  </>


                )
              }




            </div>
          </div>
          <p className='font-bold text-sm text-center underline' onClick={() => {
            setModalPix(true)
          }}>Consultar chaves PIX</p>
        </div>)


      }

      {modalPix && (
        <div className="absolute z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <ModalPixConsult closeModal={() => setModalPix(false)} />{' '}
        </div>
      )}
      <main className="flex flex-row justify-between px-10 w-full gap-4">
        <div
          onClick={() => setOperation('transactions')}
          className={`bg-white/5 backdrop-blur-lg border ${operation === 'transactions' ? 'border-white ' : 'border-white/20'} shadow-xl rounded-lg py-2 w-64`}
        >
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <div
              className={`w-16 h-16 rounded-full bg-[#000a0e]/25 shadow-sm border ${operation === 'transactions' ? 'border-white ' : 'border-[#000a0e]'} flex justify-center items-center`}
            >
              <MdPix size={30} color="white" />
            </div>
            <p className="text-lg text-white text-center">Transação</p>
          </div>
        </div>

        <div
          onClick={() => setOperation('history')}
          className={`bg-white/5 backdrop-blur-lg border ${operation === 'history' ? 'border-white ' : 'border-white/20'} shadow-xl rounded-lg py-2 w-64`}
        >
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <div
              className={`w-16 h-16 rounded-full bg-[#000a0e]/25 shadow-sm border ${operation === 'history' ? 'border-white ' : 'border-[#000a0e]'}  flex justify-center items-center`}
            >
              <FaHistory size={30} color="white" />
            </div>
            <p className="text-lg text-white text-center text-white">Histórico de transações</p>
          </div>
        </div>

        <div
          onClick={() => setOperation('chavepix')}
          className={`bg-white/5 backdrop-blur-lg border ${operation === 'chavepix' ? 'border-white ' : 'border-white/20'} shadow-xl rounded-lg py-2 w-64`}
        >
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <div
              className={`w-16 h-16 rounded-full bg-[#000a0e]/25 shadow-sm border ${operation === 'chavepix' ? 'border-white ' : 'border-[#000a0e]'} flex justify-center items-center`}
            >
              <TfiKey size={30} color="white" />
            </div>
            <p className="text-lg text-white text-center">Cadastrar chave PIX</p>
          </div>
        </div>

        <div
          onClick={() => setOperation('deposite')}
          className={`bg-white/5 backdrop-blur-lg border ${operation === 'deposite' ? 'border-white ' : 'border-white/20'} shadow-xl rounded-lg py-2 w-64`}
        >
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <div
              className={`w-16 h-16 rounded-full bg-[#000a0e]/25 shadow-sm border ${operation === 'deposite' ? 'border-white ' : 'border-[#000a0e]'} flex justify-center items-center`}
            >
              <BsCoin size={30} color="white" />
            </div>
            <p className="text-lg text-white text-center">Depositar</p>
          </div>
        </div>
      </main>
      <div className="w-full flex-1 flex justify-center items-center">
        <div className=" bg-[#000a0e]/25 shadow-sm border border-[#000a0e] w-full mx-2 p-10 items-center justify-center rounded-sm flex-col gap-8 px-5 mt-10">
          {renderScreen[operation]}
        </div>
      </div>
    </div >
  )
}

export default Transactions
