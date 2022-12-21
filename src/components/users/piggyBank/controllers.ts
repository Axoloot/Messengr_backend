import database from '../../../database';

export async function getUserPiggyBang(id: string) {
  return database.user.findUnique({ where: { id }});
}
