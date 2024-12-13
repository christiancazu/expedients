import { Body, Controller, Post } from '@nestjs/common'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { AuthService } from './auth.service'
import { Public } from './decorators/is-public.decorator'
import { SignInDto } from './dto/sign-in-auth.dto'
import { verifyAccountDto } from './dto/verify-create-account.dto'

@Public()
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('sign-in')
	signIn(@Body() signInDto: SignInDto) {
		return this.authService.signIn(signInDto)
	}

	@Post('sign-up')
	signUp(@Body() signUpDto: CreateUserDto) {
		return this.authService.signUp(signUpDto)
	}

	@Post('verify-account')
	verifyAccount(@Body() verifyAccountDto: verifyAccountDto) {
		return this.authService.verifyAccount(verifyAccountDto)
	}
}
