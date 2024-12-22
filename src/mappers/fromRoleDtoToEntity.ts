import { RoleDto } from "../interfaces/dto";
import { IRole } from "../interfaces/entities";
import { Role } from "../models";

const fromRoleDtoToEntity = (roleDto: RoleDto) => {
  const { rating, role } = roleDto;
  const roleEntity: IRole = new Role({ rating, role });
  return roleEntity;
};

export default fromRoleDtoToEntity;
