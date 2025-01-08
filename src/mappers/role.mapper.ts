import { RoleDto } from "../interfaces/dto";
import { IEvent, IRole } from "../interfaces/entities";

export default class RoleMapper {
  fromDtoToEntity(roleDto: RoleDto) {
    const { role } = roleDto;
    const roleEntity: Partial<IRole> = { role };
    return roleEntity;
  }
  getEventIds(roles: IRole[]): string[] {
    return roles
      .map((item: IRole) => item.event?._id)
      .filter((item?: string) => item !== undefined);
  }
  getEvents(roles: IRole[]): IEvent[] {
    return roles
      .map((role: IRole) => role.event)
      .filter((event?: IEvent) => event !== undefined);
  }
}
