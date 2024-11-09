import { LeftCircleOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

interface Props {
  to: string;
}

export default function NavigationBackBtn({ to }: Props): React.ReactNode {
  const navigate = useNavigate()

  return (
    <Button
      icon={ <LeftCircleOutlined style={ { fontSize: '32px' } } /> }
      style={ { height: 32, width: 32 } }
      type="text"
      onClick={ () => navigate(to) }
    />
  )
}
