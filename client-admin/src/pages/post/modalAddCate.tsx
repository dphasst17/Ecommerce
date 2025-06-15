import { Button, Input, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { StateContext } from '../../context/state'
import { CategoryPostType } from '../../types/types'
import { toast } from 'react-toastify'
import { GetToken } from '../../utils/token'
import { categoryCreate } from '../../api/post'

const ModalAddCate = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const { typePost, setTypePost } = useContext(StateContext)
    const onSubmit = async (data: { [key: string]: string }) => {
        const getType = typePost.filter((f: CategoryPostType) => f.nameType.toLocaleLowerCase() === data.name.toLocaleLowerCase())
        if (getType.length > 0) {
            toast.error('Category already exists')
            return
        }
        const currentDate = new Date().toISOString().split("T")[0]
        const dataInsert = {
            nameType: data.name,
            create_at: currentDate,
            update_at: currentDate
        }
        const token = await GetToken()
        token && categoryCreate(dataInsert, token)
            .then(res => {
                if (res.status === 201) {
                    toast.success(res.message)
                    const dataAppend = { ...dataInsert, idType: res.data.id }
                    typePost && setTypePost([...typePost, dataAppend])
                }
                else {
                    toast.error(res.message)
                }
            })
    }
    return <ModalContent>
        {(__onClose) => <>
            <ModalHeader>Add category for post</ModalHeader>
            <ModalBody>
                <div>
                    <Input {...register('name', { required: true })} type="text" label="Category name" placeholder="Category name" />
                    {errors.name && <span className='text-red-500'>This field is required</span>}
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="danger" onClick={__onClose}>Cancel</Button>
                <Button color="success" className='text-white' onClick={handleSubmit(onSubmit)}>Create</Button>
            </ModalFooter>
        </>}
    </ModalContent>
}

export default ModalAddCate