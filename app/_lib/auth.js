import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-service";

const authConfig = {
  providers: [
    Google({
      client: process.env.AUTH_GOOGLE_ID, // ID клієнта з Google API
      clientSecret: process.env.AUTH_GOOGLE_SECRET, // Секретний ключ Google API
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      // Перевірка авторизації: якщо є користувач, то дозволити доступ
      return !!auth?.user;
    },
    async signIn({ user, account, profile }) {
      //Зєднуємо google акаунт при вході з акаунтом з бази баних

      try {
        const existingGuest = await getGuest(user.email);

        //Якщо все добре то повертаємо true

        if (!existingGuest) {
          //Якщо такого акаунту немає в базі даних тоді створюємо новий з даних від google
          await createGuest({ email: user.email, fullName: user.name });
        }

        return true;
      } catch {
        return false;
      }
    },
    async session({ session, user }) {
      //Якщо в базі даних є така пошта то ми повератаємо користувача
      const guest = await getGuest(session.user.email);
      //Також добавляємо id до session відповідного користувача з бд
      session.user.guestId = guest.id;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
