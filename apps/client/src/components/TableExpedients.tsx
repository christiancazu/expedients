import React from 'react'

import { Button, ConfigProvider, Table, TableProps, Tooltip, type TableColumnsType } from 'antd'
import { Expedient, EXPEDIENT_STATUS, Review, User } from 'types'
import { dateUtil } from '../utils'
import { SearchOutlined } from '@ant-design/icons'
import { TableBase } from './base/TableBase'

interface DataType {
  key: React.Key;
  id: string;
  dataIndex?: string;
}

type Props = {
  expedients: Expedient[];
} & TableProps

const columns: TableColumnsType<DataType> = [
  {
    title: 'Código', dataIndex: 'code', key: 'code', width: 150,
    render: (text) =>
      <Tooltip title={ text }>
        <Button
          style={ { width: '142px', paddingLeft: 0, paddingRight: 4 } }
          type="link"
        >
          <span
            style={ {
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              display: 'block',
              textOverflow: 'ellipsis'
            } }
          >
            {text}
          </span>
        </Button>
      </Tooltip>
  },
  {
    title: 'Material', dataIndex: 'subject', key: 'subject'
  },
  {
    title: 'Corte', dataIndex: 'court', key: 'court'
  },
  {
    title: 'Estado', dataIndex: 'status', key: 'status', width: 140, align: 'center',
    render: (status: EXPEDIENT_STATUS) => <>
      {status.replace('_', ' ')}
    </>
  },
  {
    title: 'Actualizado Por', dataIndex: 'updatedByUser', key: 'updatedByUser', width: 140, ellipsis: true,
    render: (user: User) => <>
      {user.firstName}
      {' '}
      {user.lastName}
    </>
  },
  {
    title: 'Actualizado el', dataIndex: 'updatedAt', key: 'updatedAt', width: 130,
    render: (text: Date) => <span style={ { textAlign: 'center', textWrap: 'wrap', display: 'flex' } }>
      {dateUtil.formatDate(text)}
    </span>
  },
  {
    title: 'Última revisión', dataIndex: 'reviews', key: 'reviews', width: 300,
    render: (reviews: Review) => <>
      {reviews?.description}
    </>
  },
  {
    title: 'Acciones', key: 'actions', align: 'center', width: 100,
    render: (_, expedient) => <>
      <Tooltip title="Ver expediente">
        <Button
          icon={ <SearchOutlined /> }
          shape="circle"
        />
      </Tooltip>
    </>
  }
]

const TableExpedients: React.FC<Props> = ({ expedients, loading }: Props) => {

  return (
    <TableBase>
      <Table<DataType>
        columns={ columns }
        dataSource={ expedients }
        loading={ loading }
        pagination={ { position: ['topRight'] } }
        rowKey={ (expedient) => expedient.id }
        scroll={ { x: 1200 } }
      />
    </TableBase>
  )
}

export default TableExpedients
