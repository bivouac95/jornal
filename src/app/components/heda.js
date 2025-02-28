import { useState, useEffect } from "react";
import { Button, Navbar, NavbarContent, NavbarItem, NavbarBrand } from "@heroui/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import supabase from "../supabase";

export default function Header() {
  const [userId, setUserId] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [teacher, setTeacher] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        setErrorMessage(error.message);
      } else if (data) {
        setUserId(data.user.id);
      }
    };

    getUser();
  }, []);
  useEffect(() => {
    const getTeacher = async () => {
      if (!userId) return;
      const { data, error } = await supabase
        .from("teacher")
        .select("*")
        .eq("user_id", userId);
      if (error) {
        setErrorMessage(error.message);
      } else if (data) {
        setTeacher(data[0]);
        setIsLoaded(true);
      }
    };
    getTeacher();
  }, [userId]);

  const router = useRouter();
  return (
    <Navbar className="p-0">
      <NavbarBrand>
        <Link href="/" className="text-sm font-bold">CHTOJORNAL</Link>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <span className="text-sm">УЧИТЕЛЬ</span>
        </NavbarItem>
        <NavbarItem>
          {isLoaded ? (
            <span className="text-sm">
              {`${teacher.surname} ${teacher.name} ${teacher.second_name}`.toUpperCase()}
            </span>
          ) : (
            <p className="min-h-8 min-w-48 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded"></p>
          )}
        </NavbarItem>
        <NavbarItem>
          <Button
            onPress={() => {
              supabase.auth.signOut();
              router.push("/sign_in");
            }}
          >
            Выйти из аккаунта
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
