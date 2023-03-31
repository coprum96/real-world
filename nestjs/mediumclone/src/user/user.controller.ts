import {
  Body,
  Controller,
  Post,
  Get,
  UsePipes,
  UseGuards,
  Put,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/createUser.dto";
import { userResponseInterface } from "./types/userResponse.interface";
import { LoginUserDto } from "./dto/login.dto";
import { User } from "./decorators/user.decorator";
import { UserEntity } from "./user.entity";
import { AuthGuard } from "./guards/auth.guard";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { BackendValidationPipe } from "@app/shared/pipes/backendValidation.pipe";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("users")
  @UsePipes(new BackendValidationPipe())
  async createUser(
    @Body("user") createUserDto: CreateUserDto
  ): Promise<userResponseInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Post("users/login")
  @UsePipes(new BackendValidationPipe())
  async login(
    @Body("user") loginUserDto: LoginUserDto
  ): Promise<userResponseInterface> {
    const user = await this.userService.login(loginUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Get("user")
  @UseGuards(AuthGuard)
  async currentUser(
    @User() user: UserEntity
  ): Promise<userResponseInterface> {
    return this.userService.buildUserResponse(user);
  }

  @Put("user")
  @UseGuards(AuthGuard)
  async updateCurrentUser(
    @User("id") currentUserId: number,
    @Body("user") updateUserDto: UpdateUserDto
  ): Promise<userResponseInterface> {
    const user = await this.userService.updateUser(
      currentUserId,
      updateUserDto
    );
    return this.userService.buildUserResponse(user);
  }
}

