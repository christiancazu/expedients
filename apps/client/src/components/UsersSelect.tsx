import { useQuery } from '@tanstack/react-query'
import { Form, Select } from 'antd'
import type React from 'react'

import type { User } from '@expedients/shared'
import { getUsers } from '../services/api.service'

interface Props {
	label?: string
	name: [number, string] | string
	rules?: [{ required: boolean; message: string }]
	placeholder?: string
	onChange?: (event: any) => void
}

const UsersSelect: React.FC<Props> = ({ ...props }) => {
	const { data, isFetching } = useQuery({
		queryKey: ['users'],
		queryFn: (): Promise<User[]> => getUsers(),
	})

	return (
		<Form.Item {...props}>
			<Select
				allowClear
				showSearch
				disabled={isFetching}
				loading={isFetching}
				options={
					data?.map((user) => ({
						value: user.id,
						label: `${user.firstName} ${user.surname}`,
					})) || []
				}
				placeholder={props.placeholder}
				style={{ width: '100%' }}
				filterOption={(input, option) =>
					(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
				}
				onChange={props.onChange}
			/>
		</Form.Item>
	)
}

export default UsersSelect
