import { PART_TYPES } from '@expedients/shared'
import { Form, Select } from 'antd'
import { FormItemInputProps } from 'antd/es/form/FormItemInput'
import type React from 'react'

const partTypesOptions = Object.keys(PART_TYPES).map((status) => ({
	label: status.replace('_', ' '),
	value: status,
}))

interface Props {
	label?: string
	name: [number, string] | string
	rules?: [{ required: boolean; message: string }]
	className?: string
}

const PartsTypeSelect: React.FC<Props & FormItemInputProps> = (props) => {
	return (
		<Form.Item {...props}>
			<Select
				allowClear
				options={partTypesOptions}
				placeholder="Tipo de parte"
				style={{ width: '100%' }}
				filterOption={(input, option) =>
					(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
				}
			/>
		</Form.Item>
	)
}

export default PartsTypeSelect
