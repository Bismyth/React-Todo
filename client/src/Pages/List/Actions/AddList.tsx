import React, { useState } from 'react'
import {
  Button,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap'
import { queryCache, useMutation } from 'react-query'
import axios from 'axios'
import { Field, FieldProps, Formik, FormikHelpers, Form } from 'formik'

type List = {
  name: string
}

type AddListProps = {
  toggleTab: (id: string) => void
}

const AddList: React.FC<AddListProps> = ({ toggleTab }) => {
  const [modal, setModal] = useState(false)
  const toggle = () => {
    setModal(v => !v)
  }
  const [addList] = useMutation(async (values: List) => {
    const { data } = await axios({
      method: 'post',
      data: values,
      url: '/api/lists'
    })
    return data
  })
  return (
    <>
      <Button color='link' onClick={toggle}>
        +
      </Button>
      <Modal isOpen={modal} toggle={toggle} unmountOnClose={true}>
        <Formik
          initialValues={{ name: '' }}
          onSubmit={(values: List, { setSubmitting }: FormikHelpers<List>) => {
            addList(values, {
              onSuccess: data => {
                setSubmitting(false)
                queryCache.invalidateQueries('lists')
                toggleTab(data.list._id)
                toggle()
              }
            })
          }}
        >
          <Form>
            <ModalHeader toggle={toggle}>Add New List</ModalHeader>
            <ModalBody>
              <Field id='name' name='name'>
                {({ field }: FieldProps) => (
                  <FormGroup>
                    <Label for={field.name}>Name</Label>
                    <Input {...field} placeholder='Name...' />
                  </FormGroup>
                )}
              </Field>
            </ModalBody>
            <ModalFooter>
              <Button type='submit' color='primary'>
                Submit
              </Button>
            </ModalFooter>
          </Form>
        </Formik>
      </Modal>
    </>
  )
}

export default AddList
