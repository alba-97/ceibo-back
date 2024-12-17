import { RoleDto } from "../dto/role.dto";
import { Role } from "../models";

const fromRoleDtoToEntity = (roleDto: RoleDto) => {
  const { rating, role } = roleDto;
  const roleEntity = new Role({ rating, role });
  return roleEntity;
};

export default fromRoleDtoToEntity;
