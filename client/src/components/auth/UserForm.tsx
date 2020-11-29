import React, { useState } from 'react'
import { queryCache, useMutation } from 'react-query'
import axios, { AxiosError } from 'axios'
import {
  Alert,
  Button,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  NavItem,
  NavLink
} from 'reactstrap'
import {
  Formik,
  Field,
  Form,
  FormikHelpers,
  FieldProps,
  FormikState
} from 'formik'
import { User } from './user'

const initialValues = { username: '', password: '' }

type UserFormProps = {
  title: string
  endpoint: string
}

const UserForm: React.FC<UserFormProps> = ({ title, endpoint }) => {
  const [modal, setModal] = useState(false)
  const toggle = () => {
    setModal(v => !v)
  }
  axios({}).catch(err => {})
  const [login] = useMutation(
    async (values: User) => {
      const { data } = await axios({
        method: 'post',
        data: values,
        url: endpoint
      })
      return data
    },
    {
      onSuccess: () => {
        queryCache.invalidateQueries('user')
      }
    }
  )
  return (
    <>
      <NavItem>
        <NavLink onClick={toggle} href='#'>
          {title}
        </NavLink>
      </NavItem>
      <Modal isOpen={modal} toggle={toggle} unmountOnClose={true}>
        <Formik
          initialValues={initialValues}
          onSubmit={(
            values: User,
            { setSubmitting, setStatus }: FormikHelpers<User>
          ) => {
            login(values, {
              onSuccess: () => setSubmitting(false),
              onError: err => {
                const error = err as AxiosError
                if (error !== undefined) {
                  setStatus(error!.response!.data)
                }
              }
            })
          }}
        >
          {({ status }: FormikState<User>) => (
            <Form>
              <ModalHeader toggle={toggle}>{title}</ModalHeader>
              <ModalBody>
                {status ? <Alert color='danger'>{status.msg}</Alert> : null}
                <Field id='username' name='username'>
                  {({ field }: FieldProps) => (
                    <FormGroup>
                      <Label for={field.name}>Username</Label>
                      <Input {...field} placeholder='Username...' />
                    </FormGroup>
                  )}
                </Field>
                <Field id='password' name='password'>
                  {({ field }: FieldProps) => (
                    <FormGroup>
                      <Label for={field.name}>Password</Label>
                      <Input
                        {...field}
                        placeholder='Password...'
                        type='password'
                      />
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
    </>
  )
}

export default UserForm
