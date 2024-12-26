import { cookies } from "next/headers";

export async function getUserInfo() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("uid");
  const uid = cookie ? cookie.value : "test";
  return {
    uid,
  };
}
