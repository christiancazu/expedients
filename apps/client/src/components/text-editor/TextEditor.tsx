import React, { useState } from 'react'
import Mention from '@tiptap/extension-mention'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Button, Modal } from 'antd'
import { FileTextOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Expedient } from 'types'

import { createExpedientReview } from '../../services/api.service.ts'
import { queryClient } from '../../config/queryClient.ts'
import suggestion from './suggestion.ts'

import './text-editor.scss'
import useNotify from '../../composables/useNotification.tsx'

const TextEditor: React.FC<{ expedientId: string }> = ({ expedientId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
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
              class: 'mention'
            },

            `${node.attrs.id}`
          ]
        },
        HTMLAttributes: {
          class: 'mention'
        },
        suggestion
      })
    ],
    editorProps: {
      attributes: {
        spellcheck: 'false'
      }
    }
  })

  const { isFetching, refetch } = useQuery(
    {
      queryKey: ['createExpedient'],
      queryFn: () => createExpedientReview({ description: editor?.getHTML() as string, expedientId }), enabled: false
    })

  const showModal = () => {
    setIsModalOpen(true)
    setTimeout(() => {
      editor?.commands.focus()
    }, 1)
  }

  const handleOk = async () => {
    const { status, data } = await refetch()

    if (status === 'success') {
      queryClient.setQueryData(
        ['expedient', expedientId],
        (old: Expedient) => ({
          ...old,
          updatedAt: data.createdAt,
          reviews: [{
            description: editor?.getHTML() as string,
            id: data.id,
            createdAt: data.createdAt,
            createdbyUser: {
              firstName: 'christian', // TODO FROM USER
              lastName: 'christian'
            }
          }, ...old.reviews]
        }))
      notify({ message: 'Informe creado con éxito' })

      handleCloseModal()
    }
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
        Crear un informe
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
            loading={ isFetching }
            type="primary"
            onClick={ handleOk }
          >
            Crear
          </Button>
        ] }
        onCancel={ handleCloseModal }
      >
        <EditorContent editor={ editor } />
      </Modal>
    </>
  )
}

export default TextEditor
