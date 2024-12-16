import { useQuery } from '@tanstack/react-query'
import { Form, Select, Tag } from 'antd'
import type React from 'react'

import type { User } from '@expedients/shared'
import { DefaultOptionType } from 'antd/es/select'
import { SelectProps } from 'antd/lib'
import UserAvatarName from '../modules/shared/components/UserAvatarName'
import { getUsers } from '../services/api.service'

type TagRender = SelectProps['tagRender']

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
		queryFn: () => getUsers(),
	})

	// @ts-ignore
	const tagRender: TagRender = (props) => {
		// @ts-ignore
		const { value, closable, onClose } = props

		let user = null

		if (data) {
			user = data!.find((user) => user.id === value)
		}

		const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
			event.preventDefault()
			event.stopPropagation()
		}

		return user ? (
			<Tag onMouseDown={onPreventMouseDown} onClose={onClose}>
				<UserAvatarName user={user!} />
			</Tag>
		) : (
			<div>todo</div>
		)
	}

	return (
		<Form.Item {...props}>
			<Select<string, DefaultOptionType & User>
				allowClear
				showSearch
				disabled={isFetching}
				loading={isFetching}
				options={
					data?.map((user) => ({
						...user,
						value: user.id,
						label: `${user.firstName} ${user.surname}`,
					})) || []
				}
				optionRender={(option) => <UserAvatarName user={option.data} />}
				placeholder={props.placeholder}
				className="w-full"
				filterOption={(input, option) =>
					((option?.label as string) ?? '')
						.toLowerCase()
						.includes(input.toLowerCase())
				}
				onChange={props.onChange}
			/>
		</Form.Item>
	)
}

export default UsersSelect
