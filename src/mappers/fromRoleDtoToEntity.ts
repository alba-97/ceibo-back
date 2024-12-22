import { RoleDto } from "../interfaces/dto";
import { AddRole } from "../interfaces/entities/create";

const fromRoleDtoToEntity = (roleDto: RoleDto) => {
  const { role } = roleDto;
  const roleEntity: AddRole = { role };
  if (roleDto.rating) roleEntity.rating = roleDto.rating;
  return roleEntity;
};

export default fromRoleDtoToEntity;
