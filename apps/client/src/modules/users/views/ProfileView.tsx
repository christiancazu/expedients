import { Button, Card, Divider, Flex, Spin } from 'antd'
import { useRef, useState } from 'react'
import ReactCrop, { centerCrop, Crop, makeAspectCrop } from 'react-image-crop'
import NavigationBackBtn from '../../../components/NavigationBackBtn'
import 'react-image-crop/src/ReactCrop.scss'
import { FileImageOutlined } from '@ant-design/icons'
import { User } from '@expedients/shared'
import { useMutation, useQuery } from '@tanstack/react-query'
import useNotify from '../../../hooks/useNotification'
import useUserState from '../../../hooks/useUserState'
import { getMe, uploadAvatar } from '../../../services/api.service'

export default function ProfileView(): React.ReactNode {
	const [crop, setCrop] = useState<Crop>()
	const [imgSrc, setImgSrc] = useState<string>()
	const imgRef = useRef<HTMLImageElement>(null)

	const { setUser } = useUserState()

	const notify = useNotify()
	const { refetch } = useQuery<User>({
		queryKey: ['me'],
		queryFn: () => getMe(),
		enabled: false,
	})

	const { mutate, isPending } = useMutation({
		mutationKey: ['avatar-upload'],
		mutationFn: uploadAvatar,
		onSuccess: () => {
			notify({ message: 'El avatar ha sido actualizado' })
			refetch().then(({ data }) => setUser(data!))
		},
	})

	const handleLoadFile = (e: any) => {
		if (e.target.files && e.target.files.length > 0) {
			setCrop(undefined)
			const reader = new FileReader()
			reader.addEventListener('load', () =>
				setImgSrc(reader.result?.toString() || ''),
			)
			reader.readAsDataURL(e.target.files[0])
		}
	}

	const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
		const { width, height } = e.currentTarget

		const crop = centerCrop(
			makeAspectCrop(
				{
					unit: '%',
					width: 50,
				},
				1,
				width,
				height,
			),
			width,
			height,
		)

		setCrop(crop)
	}

	const handleSaveAvatar = async () => {
		const image = imgRef.current
		if (!image || !crop) {
			return
		}

		const canvas = document.createElement('canvas')
		const scaleX = image.naturalWidth / image.width
		const scaleY = image.naturalHeight / image.height
		canvas.width = crop.width
		canvas.height = crop.height
		const ctx = canvas.getContext('2d')!

		const pixelRatio = window.devicePixelRatio
		canvas.width = crop.width * pixelRatio
		canvas.height = crop.height * pixelRatio
		ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
		ctx.imageSmoothingQuality = 'high'

		ctx.drawImage(
			image,
			crop.x * scaleX,
			crop.y * scaleY,
			crop.width * scaleX,
			crop.height * scaleY,
			0,
			0,
			crop.width,
			crop.height,
		)

		canvas.toBlob(
			(blob) => {
				const formData = new FormData()
				formData.append('file', blob!)

				mutate(formData)
			},
			'image/png',
			1,
		)
	}

	return (
		<section>
			<NavigationBackBtn to="/expedients" />
			<Divider className="my-3" />
			<Flex justify="center">
				<Card
					className="mt-8 w-full"
					title="Modificar avatar"
					style={{ maxWidth: '480px' }}
				>
					<Spin spinning={isPending}>
						<Flex justify="space-between">
							<Button
								type="default"
								icon={<FileImageOutlined />}
								onClick={() => document.getElementById('inputAvatar')?.click()}
							>
								Elegir avatar
							</Button>
							{imgSrc && (
								<Button
									type="primary"
									loading={isPending}
									icon={<FileImageOutlined />}
									className="mb-5"
									onClick={handleSaveAvatar}
								>
									Guardar avatar
								</Button>
							)}
						</Flex>
						<input
							type="file"
							hidden
							id="inputAvatar"
							accept="image/*"
							onChange={handleLoadFile}
						/>

						{imgSrc && (
							<ReactCrop
								className="mt-4"
								circularCrop
								aspect={1}
								crop={crop}
								minHeight={100}
								onChange={(c) => setCrop(c)}
							>
								<img
									ref={imgRef}
									src={imgSrc}
									alt="avatar"
									onLoad={handleImageLoad}
								/>
							</ReactCrop>
						)}
					</Spin>
				</Card>
			</Flex>
		</section>
	)
}
