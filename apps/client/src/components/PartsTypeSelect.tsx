import { PART_TYPES } from '@expedients/shared'
import { Form, Select } from 'antd'
import type React from 'react'

const partTypesOptions = Object.keys(PART_TYPES).map((status) => ({
	label: status.replace('_', ' '),
	value: status,
}))

interface Props {
	label?: string
	name: [number, string] | string
	rules?: [{ required: boolean; message: string }]
}

const PartsTypeSelect: React.FC<Props> = (props) => {
	return (
		<Form.Item {...props}>
			<Select
				allowClear
				options={partTypesOptions}
				placeholder="Tipo"
				style={{ width: '100%' }}
				filterOption={(input, option) =>
					(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
				}
			/>
		</Form.Item>
	)
}

export default PartsTypeSelect
