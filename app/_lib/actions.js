"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

export async function createBooking(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    hasBreakfast: false,
    isPaid: false,
    status: "unconfirmed",
  };

  const { error } = await supabase.from("bookings").insert([newBooking]);

  if (error) throw new Error("Booking could not be created");

  revalidatePath(`/cabins/${bookingData.cabinId}`);

  redirect("/cabins/thankyou");
}

export async function updateGuest(formData) {
  //Відбувається через form action
  //formData - дані з форми
  const session = await auth();
  if (!session) throw new Error("You must be logged in");
  //отримуємо дані з нашої форми користувача
  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Please provide a valid national ID");

  const updateData = { nationality, countryFlag, nationalID };
  /// оновлюємо дані в бд
  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) {
    throw new Error("Guest could not be updated");
  }

  //Оновлюємо кеш відповідної сторінки щоб показати оновлені дані з бд
  revalidatePath("/account/profile");
}

export async function deleteReservation(bookingId) {
  //Відбувається через onClick
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  //Добавляємо додаткову перевірку щоб видалення міг робити тільки користувач з поточним  id
  //який має це бронювання
  const guestBookins = await getBookings(session.user.guestId);
  const guestBookinsIds = guestBookins.map((booking) => booking.id);

  if (!guestBookinsIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) throw new Error("Booking could not be deleted");

  //Оновлюємо кеш відповідної сторінки щоб показати оновлені дані з бд
  revalidatePath("/account/reservations");
}

export async function updateBooking(formData) {
  const bookingId = Number(formData.get("bookingId"));

  //1) Authentication
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  //2) Authorization
  const guestBookins = await getBookings(session.user.guestId);
  const guestBookinsIds = guestBookins.map((booking) => booking.id);

  if (!guestBookinsIds.includes(bookingId))
    throw new Error("You are not allowed to update this booking");

  // 3) Building update data
  const updatedData = {
    //slice щоб не було більше ніж 1000 символів
    observations: formData.get("observations").slice(0, 1000),
    numGuests: Number(formData.get("numGuests")),
  };

  // 4) Mutation
  const { error } = await supabase
    .from("bookings")
    .update(updatedData)
    .eq("id", bookingId)
    .select()
    .single();

  //5) Error handling
  if (error) throw new Error("Booking could not be updated");

  //6) Revalidate
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath("/account/reservations");

  //6) Redirecting
  redirect("/account/reservations");
}

export async function signInAction() {
  //Якщо коористувач залогінився то перенаправити його на акаунт
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
