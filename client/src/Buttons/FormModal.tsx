import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  FormGroup,
  Label,
  Input,
  Button
} from 'reactstrap'
import { Formik, Field, Form, FormikHelpers, FieldProps } from 'formik'
import { v4 as uuid } from 'uuid'
import { setData } from './Types'

interface Values {
  name: string
  description: string
}
type FormModalProps = {
  setData: setData
  toggle: () => void
  modal: boolean
  name: string
  initialValues: Values
  id?: string
}

const FormModal = ({
  setData,
  toggle,
  modal,
  name,
  initialValues,
  id
}: FormModalProps) => {
  return (
    <Modal isOpen={modal} toggle={toggle} unmountOnClose={true}>
      <Formik
        initialValues={initialValues}
        onSubmit={(
          values: Values,
          { setSubmitting, resetForm }: FormikHelpers<Values>
        ) => {
          console.log(values)
          if (id) {
            setData(v => {
              console.log(v)
              return v.map(i => {
                if (i.id === id) {
                  return { ...i, ...values }
                } else {
                  return i
                }
              })
            })
            resetForm()
          } else {
            const task = {
              ...values,
              id: uuid(),
              dateCreated: Date.now(),
              completed: false,
              dateCompleted: 0
            }
            setData(v => [...v, task])
            resetForm()
          }
          setSubmitting(false)
          toggle()
        }}
      >
        {({ resetForm }: FormikHelpers<Values>) => (
          <Form>
            <ModalHeader toggle={toggle}>{name}</ModalHeader>

            <ModalBody>
              <Field id='name' name='name'>
                {({ field }: FieldProps) => (
                  <FormGroup>
                    <Label for={field.name}>Name</Label>
                    <Input {...field} placeholder='Name...' />
                  </FormGroup>
                )}
              </Field>
              <Field id='description' name='description'>
                {({ field }: FieldProps) => (
                  <FormGroup>
                    <Label for={field.name}>Description</Label>
                    <Input {...field} placeholder='Desciption...' />
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
        )}
      </Formik>
    </Modal>
  )
}

export default FormModal
