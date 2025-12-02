import { api } from "@/providers/api"
import { useEffect, useState } from "react"
import { IoPlayBack } from "react-icons/io5"
import { TbPlayerTrackNextFilled } from "react-icons/tb"
import { TransactionsUserProps } from "./interface"

type TransactionHistoryProps = {
    userId: string
}

const TransactionHistory = ({ userId }: TransactionHistoryProps) => {
    const [transactionsUser, setTransactionsUser] = useState<TransactionsUserProps[]>()
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [totalPage, setTotalPage] = useState<number | null>(null)

    useEffect(() => {
        const teste = async () => {
            const response = await api.get(`/v1/usuarios/${localStorage.getItem("UserId")}/transacoes/${pageNumber}`)
            setTotalPage(response.data.totalPages)
            setTransactionsUser(response.data.transacoesEChaveRelacionada)
        }

        teste()

    }, [pageNumber])

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


    return (

        <div className="bg-[#000a0e]/25 flex-col  p-4 gap-4 flex">
            <div className=' max-h-80 overflow-auto gap-4 flex flex-col' key={pageNumber}>


                <div className='flex flex-row justify-between items-center'>
                    <p className='font-bold text-sm text-center w-[20%] max-w-[20%] '>CHAVE UTILIZADA</p>
                    <p className='font-bold text-sm text-center w-[20%] max-w-[20%] '>USUÁRIO DESTINO</p>
                    <p className='font-bold text-sm text-center w-[20%] max-w-[20%] '>CHAVE DESTINO</p>
                    <p className='font-bold text-sm text-center w-[20%] max-w-[20%]'>VALOR</p>
                    <p className='font-bold text-sm text-center w-[20%] max-w-[20%]'>DATA</p>
                    <p className='font-bold text-sm text-center w-[20%] max-w-[20%]'>ID</p>

                </div>
                <div className='w-full h-[0.2px] my-2 bg-white opacity-40' />
                {


                    transactionsUser?.map((i) => {
                        return (
                            <div key={i?.id + 'avar'} className='flex flex-col'>
                                <div className='flex flex-row justify-between items-center'>
                                    <p className='text-xs text-center w-[20%] max-w-[20%] text-white'>{i?.chaveEnvio}</p>
                                    <p className='text-xs text-center w-[20%] max-w-[20%] text-white'>{i?.nomeDestinatario}</p>
                                    <p className='text-xs text-center w-[20%] max-w-[20%] text-white'>{i?.chaveDestino}</p>
                                    <p className='text-xs text-center w-[20%] max-w-[20%]'>{i?.valor}</p>
                                    < p className='text-xs text-center w-[20%] max-w-[20%]'>{i?.data_transferencia}</p>
                                    < p className='text-xs text-center w-[20%] max-w-[20%]'>{i?.id}</p>
                                </div>
                                <div className='w-full h-[0.2px] my-4 bg-white opacity-20' />                       </div>
                        )

                    })
                }

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

export default TransactionHistory   