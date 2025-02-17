"use client";

import supabase from "../supabase";
import CreateSubject from "../components/create_subject";

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

export default function Subjects() {
  const [userId, setUserId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [teacher, setTeacher] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [groups, setGroups] = useState([]);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubjectsLoaded, setIsSubjectsLoaded] = useState(false);

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
    const getSubjects = async () => {
      const { data, error } = await supabase.from("subject").select("*");
      if (error) {
        setErrorMessage(error.message);
      } else if (data) {
        setSubjects(data);
      }
    };
    getSubjects();
  }, []);

  useEffect(() => {
    const getGroups = async () => {
      const { data, error } = await supabase.from("group").select("*");
      if (error) {
        setErrorMessage(error.message);
      } else if (data) {
        setGroups(data);
        setIsSubjectsLoaded(true);
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
            <Button onPress={() => router.push("/groups")}>Группы</Button>
          </NavbarItem>
          <NavbarItem>
            <Button isDisabled={true}>Предметы</Button>
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
        {isSubjectsLoaded ? (
          <p>Всего предметов: {subjects.length}</p>
        ) : (
          <h1 className="h-6 w-52 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded"></h1>
        )}

        {isSubjectsLoaded ? (
          subjects.map((subject) => (
            <Card key={subject.id}>
              <CardHeader>
                <Link
                  href={`/subject/${subject.id}`}
                  key={subject.id}
                  className="w-full"
                >
                  <h1 className="font-bold">Дисциплина {subject.id}</h1>
                </Link>
              </CardHeader>
              <CardBody className="gap-2">
                <p>{subject.name}</p>
                <p>
                  {groups.find((group) => subject.group_id === group.id).name}
                </p>
              </CardBody>
            </Card>
          ))
        ) : (
          <div></div>
        )}
        <Card className={isSubjectsLoaded ? "w-full" : "hidden"}>
          <CardHeader>
            <h1 className="font-bold">Добавить новую</h1>
          </CardHeader>
          <CardBody>
            <CreateSubject />
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
