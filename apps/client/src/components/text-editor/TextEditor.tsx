import React, { useEffect, useMemo, useRef, useState } from 'react'
import Mention from '@tiptap/extension-mention'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Badge, Button, DatePicker, GetProps, Modal, Typography } from 'antd'
import { FileTextOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import { Expedient } from '@expedients/shared'

import dayjs from 'dayjs'

import { createExpedientReview } from '../../services/api.service.ts'
import { queryClient } from '../../config/queryClient.ts'
import suggestion from './suggestion.ts'
import useNotify from '../../composables/useNotification'

import './text-editor.scss'
import useUserState from '../../composables/useUserState.tsx'

const { Text } = Typography

interface DocumentSuggestion {
  id: string;
  label: string;
}

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>

const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  return current && current > dayjs().endOf('day')
}

const TextEditor: React.FC<{ expedientId: string }> = ({ expedientId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { user } = useUserState()

  const now = dayjs(new Date().toISOString(), 'YYYY-MM-DD HH:mm').subtract(5, 'hour')
  const createdAt = useRef(new Date().toISOString())

  const expedient = queryClient.getQueryData<Expedient>(['expedient', expedientId]) as Expedient

  const getSuggestions = useMemo(() => expedient.documents.map<DocumentSuggestion>(d => ({
    id: d.id,
    label: d.name
  })), [expedient])

  const notify = useNotify()

  const editor = useEditor({
    extensions: [
      StarterKit,
      Mention.configure({
        renderHTML(props) {
          const { node } = props
          return [
            'span',
            {
              class: 'mention',
              ['data-id']: node.attrs.id
            },

            `${node.attrs.label}`
          ]
        },
        HTMLAttributes: {
          class: 'mention'
        },
        suggestion: {
          ...suggestion,
          items: ({ query }: { query: string }) => {
            return getSuggestions.filter(item => item.label.toLowerCase().startsWith(query.toLowerCase()))
          }
        }
      })
    ],
    editorProps: {
      attributes: {
        spellcheck: 'false'
      }
    }
  })

  useEffect(() => {
    editor?.destroy()
  }, [expedient])

  const { isPending, mutate } = useMutation({
    mutationFn: () => createExpedientReview({
      description: editor?.getHTML() as string,
      createdAt: createdAt.current,
      expedientId
    }),
    onSuccess: (data) => {
      queryClient.setQueryData(
        ['expedient', expedientId],
        (old: Expedient) => ({
          ...old,
          updatedAt: data.createdAt,
          reviews: [
            {
              description: editor?.getHTML() as string,
              id: data.id,
              createdAt: data.createdAt,
              createdByUser: {
                id: user?.id,
                firstName: user?.firstName,
                lastName: user?.lastName
              }
            },
            ...old.reviews
          ].sort((a, b) => (dayjs(a.createdAt).isBefore(dayjs(b.createdAt)) ? 1 : -1))
        }))

      notify({ message: 'Informe creado con éxito' })

      handleCloseModal()
    },
    onError() {
      notify({ message: 'Ha sucedido un error al crear el informe', type: 'error' })
    }
  })

  const showModal = () => {
    setIsModalOpen(true)
    setTimeout(() => {
      editor?.commands.focus()
    }, 1)
  }

  const handleOk = () => {
    if (editor?.getText() === '') {
      notify({ message: 'El informe no puede estar vacío', type: 'info' })
      return
    }

    mutate()
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    editor?.commands.clearContent(true)
  }

  return (
    <>
      <Button
        icon={ <FileTextOutlined /> }
        type="primary"
        onClick={ showModal }
      >
        Crear informe
      </Button>
      <Modal
        cancelText="Cancelar"
        open={ isModalOpen }
        title="Crear informe"
        footer={ [
          <Button
            key="back"
            onClick={ handleCloseModal }
          >
            Cancelar
          </Button>,
          <Button
            icon={ <FileTextOutlined /> }
            key="submit"
            loading={ isPending }
            type="primary"
            onClick={ handleOk }
          >
            Crear
          </Button>
        ] }
        onCancel={ handleCloseModal }
      >
        <DatePicker
          allowClear={ false }
          className='mb-20'
          defaultValue={ now }
          disabledDate={ disabledDate }
          placeholder='Seleccione una fecha'
          onChange={ (value) => {
            createdAt.current = value.toISOString()
          } }
        />

        <EditorContent
          editor={ editor }
        />

        <div className='d-flex my-8'>
          <Badge
            color="cyan"
            count={ 'TIP' }
          />
          <Text
            className='ml-8'
            type="secondary"
          >
            usar @ para referenciar un documento
          </Text>
        </div>

      </Modal>
    </>
  )
}

export default TextEditor
