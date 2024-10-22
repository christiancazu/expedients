import {
  forwardRef, useEffect, useImperativeHandle,
  useState
} from 'react'

export const MentionList = forwardRef((props: any, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = (index: number) => {
    const item = props.items[index]

    if (item) {
      props.command({ id: item.id, label: item.label })
    }
  }

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => setSelectedIndex(0), [props.items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: {event: KeyboardEvent}) => {
      if (event.key === 'ArrowUp') {
        upHandler()
        return true
      }

      if (event.key === 'ArrowDown' || event.key === 'Tab') {
        downHandler()
        return true
      }

      if (event.key === 'Enter') {
        enterHandler()
        return true
      }

      return false
    }
  }))

  return (
    <div className="mention-dropdown-menu">
      {props.items.length
        ? props.items.map((item: any, index: number) => (
          <button
            className={ index === selectedIndex ? 'mention' : '' }
            key={ index }
            onClick={ () => selectItem(index) }
          >
            {item.label}
          </button>
        ))
        : <div>Sin Resultados</div>
      }
    </div>
  )
})
