export default interface UserDto {
  username: string;
  password: string;
  email: string;
  first_name?: string;
  last_name?: string;
  birthdate?: Date;
  phone?: string;
  profile_img?: string;
  address?: string;
  new_user?: boolean;
}
