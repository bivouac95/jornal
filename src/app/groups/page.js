"use client";

import supabase from "../supabase";
import CreateGroup from "../components/create_group";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
  Input,
  Button,
  Alert,
  Navbar,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [userId, setUserId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [teacher, setTeacher] = useState({});
  const [grouplist, setGrouplist] = useState([]);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isGrouplistLoaded, setIsGrouplistLoaded] = useState(false);

  const router = useRouter();
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
    if (userId !== "") {
      getTeacher();
    }
  }, [userId]);

  useEffect(() => {
    const getGroups = async () => {
      const { data, error } = await supabase.from("group").select("*");
      if (error) {
        setErrorMessage(error.message);
      } else if (data) {
        setGrouplist(data);
        setIsGrouplistLoaded(true);
      }
    };
    getGroups();
  }, []);

  return (
    <main className=" flex flex-col items-center gap-4">
      <Navbar>
        <NavbarContent>
          <NavbarItem>
            <p>Профиль учителя</p>
          </NavbarItem>
          <NavbarItem>
            <Button onPress={() => router.push("/")}>Студенты</Button>
          </NavbarItem>
          <NavbarItem>
            <Button isDisabled={true}>Группы</Button>
          </NavbarItem>
          <NavbarItem>
            <Button onPress={() => router.push("/subjects")}>Предметы</Button>
          </NavbarItem>
          <NavbarItem>
            <Button
              onPress={() => {
                supabase.auth.signOut();
                router.push("/sign_in");
              }}
              color="danger"
            >
              Выйти из аккаунта
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <section className="flex flex-col gap-2 w-[65vw]">
        {isLoaded ? (
          <h1 className="text-2xl">Добро пожаловать, {teacher.name}</h1>
        ) : (
          <h1 className="h-6 w-64 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded"></h1>
        )}
        <Divider />
        <h2 className="font-bold">Статистика</h2>
        {isGrouplistLoaded ? (
          <p>Всего групп: {grouplist.length}</p>
        ) : (
          <h1 className="h-6 w-52 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded"></h1>
        )}

        {isGrouplistLoaded ? (
          grouplist.map((group) => (
            <Card key={group.id}>
              <CardHeader>
                <Link
                  href={`/group/${group.id}`}
                  key={group.id}
                  className="w-full"
                >
                  <h1 className="font-bold">Группа {group.id}</h1>
                </Link>
              </CardHeader>
              <CardBody>
                <p>{group.name}</p>
              </CardBody>
            </Card>
          ))
        ) : (
          <div></div>
        )}
        <Card className={isGrouplistLoaded ? "w-full" : "hidden"}>
          <CardHeader>
            <h1 className="font-bold">Добавить группу</h1>
          </CardHeader>
          <CardBody>
            <CreateGroup />
          </CardBody>
        </Card>
      </section>

      <Alert
        className="absolute bottom-3 left-3 w-96"
        color="danger"
        isVisible={errorMessage !== ""}
      >
        <p>{errorMessage}</p>
      </Alert>
    </main>
  );
}
