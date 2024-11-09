import { Button, ButtonProps } from 'antd'
import { CloseOutlined } from '@ant-design/icons'

type Props = {
  primary?: boolean;
  secondary?: boolean;
  cancel?: boolean;
} & ButtonProps

export default function ButtonBase({ primary, secondary, cancel, ...props }: Props): React.ReactNode {
  return (
    <Button
      { ...props }
      color={ cancel ? 'default' : 'primary' }
      variant={ primary ? 'solid' : secondary ? 'outlined' : 'text' }
      icon={ props.icon ?
        <>
          {props.icon}
        </> :
        cancel
          ? <CloseOutlined />
          : undefined }
    >
      {props.children ?? 'Cancelar' }
    </Button>
  )
}
