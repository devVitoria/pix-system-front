import { useForm } from '@tanstack/react-form'
import { FaSearch } from 'react-icons/fa'
import { IoMdCloseCircle, IoMdTrash } from 'react-icons/io'
import { IoPlayBack } from 'react-icons/io5'
import { MdContentCopy, MdPersonSearch } from 'react-icons/md'
import { TbPlayerTrackNextFilled } from 'react-icons/tb'
import { ModalPixConsultProps, PixUserData } from './interface'
import { useEffect, useState } from 'react'
import { api } from '@/providers/api'
import { toast } from 'react-toastify'
import { set } from 'zod'

const ModalPixConsult = ({ closeModal }: ModalPixConsultProps) => {
  const [allPixKeys, setAllPixKeys] = useState<PixUserData[]>()
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [totalPage, setTotalPage] = useState<number | null>(null)
  const [searchClicked, setSearchClicked] = useState(false)
  const [recall, setRecall] = useState(false)

  const form = useForm({
    defaultValues: {
      cpf: '',
    },
    onSubmit: async ({ value }) => {
    },
  })

  const { Field } = form

  useEffect(() => {
    const callApi = async () => {
      setSearchClicked(false)

      const keys = await api.get(`/v1/chaves/all-keys/${pageNumber}?${form.getFieldValue('cpf').length === 11 ? `cpfcnpj=${form.getFieldValue('cpf')}` : `cpfcnpj='nada'`}`)

      setAllPixKeys(keys.data.results)
      setTotalPage(keys.data.totalPages)
    }
    callApi()
  }, [pageNumber, searchClicked, recall])


  const handleChangePage = (type: string) => {
    if (type === 'next') {
      if (pageNumber !== totalPage) {
        setPageNumber(pageNumber + 1)
        return
      }
    }

    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1)
      return
    }
  }

  const handleDelete = async (chave: string) => {

    const deleteKey = await api.delete(`/v1/chaves/${chave}`)

    if (deleteKey.status === 204) {
      toast.success("Chave PIX deletada com sucesso!")
      setRecall(!recall)
      return
    }
    toast.error("Erro ao deletar chave PIX.")

  }


  return (
    <div className="w-full h-full bg-white/95 p-10 rounded-sm">
      <div className="absolute top-4 right-4 cursor-pointer " onClick={closeModal}>
        <IoMdCloseCircle size={20} color="#031d2b" />
      </div>
      <h3 className="text-base text-[#062531] font-bold text-center">Consulta de Chave PIX</h3>
      <p className="text-[#062531] text-sm ">
        Digite um CPF no campo abaixo para buscar dados específicos
      </p>

      <Field name="cpf">
        {(field) => (
          <div className="flex flex-col gap-2 justify-center items-center">
            <div className="flex flex-row gap-1 items-center pt-4 justify-start ms-1 w-full">
              <MdPersonSearch size={20} color="#031d2b" />

              <label
                htmlFor={field.name}
                className="text-start w-10/12 text-[#031d2b] font-bold text-sm"
              >
                CPF
              </label>
            </div>
            <input
              title="email"
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className="w-full overflow-hidden bg-[#031d2b]/25  border border-[#031d2b]/20 rounded-lg px-4 py-[9px] text-[#031d2b] placeholder-white/50 focus:border-white/30 focus:outline-none"
            />
            <div className="p-[11px] bg-gradient-to-r from-[#326579] via-[#446b77] to-[#8ba3ad] backdrop-blur-lg justify-center items-center absolute right-10 top-[128px] rounded-r-lg border  border-[#031d2b]/20 cursor-pointer">
              <FaSearch size={18} color="white" onClick={() => {
                setSearchClicked(true)
              }} />
            </div>
          </div>
        )}
      </Field>

      <div className="w-full mt-6">
        <div className="w-full h-1/2 border-1 border-[#326579] rounded-md">
          <div className="flex flex-row justify-around py-3 bg-[#326579] rounded-t-md">
            <p className="text-white text-sm font-bold text-center">CPF</p>
            <p className="text-white text-sm font-bold text-center">Nome</p>
            <p className="text-white text-sm font-bold text-center">Chave</p>

          </div>
          {allPixKeys?.map((e, index) => (
            <div key={index} className="flex flex-row w-full  px-5 py-3 border-b border-gray-300">
              <p className="text-[#031d2b] text-xs w-32 text-center">{e.cpfcnpj}</p>
              <p className="text-[#031d2b] text-xs text-center w-32">{e.nome}</p>
              <div className="flex flex-row w-32 items-center gap-1 justify-end">
                <p className="text-[#031d2b] text-xs">{e.chave} </p>
                <MdContentCopy color="#031d2b" />
              </div>
              {e.usuarioId === Number(localStorage.getItem("UserId") ?? 0) && <div onClick={(() => { handleDelete(e.chave) })}
                className="w-10 justify-center items-center flex cursor-pointer hover:bg-red-50 transition-colors"><IoMdTrash color='#82181a' size={20} />
              </div>}
            </div>

          ))}

        </div>
        <div className="flex flex-row gap-2 pt-1 w-full justify-end items-center">
          <IoPlayBack color={pageNumber === 1 ? "#859094" : "#326579"} className="cursor-pointer" onClick={() => { handleChangePage('back') }} />

          <div className="w-6 h-4 rounded-sm bg-[#326579] flex justify-center items-center">
            <p className="text-xs">{pageNumber}</p>
          </div>
          <p className="text-[#326579] font-bold">...</p>
          <div className="w-6 h-4  rounded-sm bg-[#326579] flex justify-center items-center">
            <p className="text-xs">{totalPage}</p>
          </div>
          <TbPlayerTrackNextFilled color={pageNumber === totalPage ? "#859094" : "#326579"} className="cursor-pointer" onClick={() => { handleChangePage('next') }} />
        </div>
      </div>
    </div >
  )
}
export default ModalPixConsult
