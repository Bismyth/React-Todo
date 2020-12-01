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
import { MutateFunction } from 'react-query'

interface Values {
  name: string
  description: string
}
type FormModalProps = {
  upload: MutateFunction<any, unknown, Values, unknown>
  toggle: () => void
  modal: boolean
  name: string
  initialValues: Values
  id?: string
}

const FormModal = ({
  upload,
  toggle,
  modal,
  name,
  initialValues
}: FormModalProps) => {
  return (
    <Modal isOpen={modal} toggle={toggle} unmountOnClose={true}>
      <Formik
        initialValues={initialValues}
        onSubmit={(
          values: Values,
          { setSubmitting }: FormikHelpers<Values>
        ) => {
          upload(values).then(() => {
            setSubmitting(false)
            toggle()
          })
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
