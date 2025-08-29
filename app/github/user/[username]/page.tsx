import { User } from "@/app/types";
import UserClient from "./UserClient";

interface Props {
  params: { username: string };
}

export default async function UserPage({ params }: Props) {
  const { username } = params;

  // buscar dados no servidor
  const userRes = await fetch(`https://api.github.com/users/${username}`, {
    next: { revalidate: 60 }, // cache de 1 minuto
  });
  const user: User = await userRes.json();

  // manda só o user pro client
  return <UserClient user={user} />;
}
