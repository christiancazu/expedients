import React, { useEffect, useMemo, useRef, useState } from 'react'
import Mention from '@tiptap/extension-mention'

import { EditorContent, useEditor, Extension, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Button, DatePicker, GetProps, Modal, Tag } from 'antd'
import { FileTextOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import { Expedient } from '@expedients/shared'

import dayjs from 'dayjs'

import { createExpedientReview } from '../../services/api.service.ts'
import { queryClient } from '../../config/queryClient.ts'
import suggestion from './suggestion.ts'
import useNotify from '../../composables/useNotification'
import useUserState from '../../composables/useUserState.tsx'

import './text-editor.scss'

interface DocumentSuggestion {
  id: string;
  label: string;
}
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>

const MentionStorage = Extension.create({
  name: 'mentionStorage',
  addStorage() {
    return {
      mentions: []
    }
  }
})

const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  return current && current > dayjs().endOf('day')
}

const TextEditor: React.FC<{ expedientId: string }> = ({ expedientId }) => {
  const notify = useNotify()
  const { user } = useUserState()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const expedient = queryClient.getQueryData<Expedient>(['expedient', expedientId]) as Expedient

  const getSuggestions = useMemo(() => expedient.documents.map<DocumentSuggestion>(d => ({
    id: d.id,
    label: d.name
  })), [expedient])

  const editor = useEditor({
    extensions: [
      StarterKit,
      MentionStorage,
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
          items: ({ query, editor }: {query: string; editor: Editor}) => {
            const suggestions: DocumentSuggestion[]  = editor.storage.mentionStorage.mentions
            return suggestions.filter(item => item.label.toLowerCase().startsWith(query.toLowerCase()))
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
    if (editor) {
      editor.storage.mentionStorage.mentions = getSuggestions
    }

    return () => editor?.destroy()
  }, [getSuggestions, editor])

  const now = dayjs(new Date().toISOString(), 'YYYY-MM-DD HH:mm').subtract(5, 'hour')
  const createdAt = useRef(new Date().toISOString())

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
          <Tag color="cyan">
            {' '}
            usar @ para referenciar un documento
          </Tag>
        </div>

      </Modal>
    </>
  )
}

export default TextEditor
