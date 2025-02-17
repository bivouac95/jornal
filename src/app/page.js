"use client";

import supabase from "./supabase";
import CreateStudent from "./components/create_student";
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
  const [studentlist, setStudentlist] = useState([]);
  const [grouplist, setGrouplist] = useState([]);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isStudentlistLoaded, setIsStudentlistLoaded] = useState(false);

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
    const getStudentlist = async () => {
      const { data, error } = await supabase.from("student").select("*");
      if (error) {
        setErrorMessage(error.message);
      } else if (data) {
        setStudentlist(data);
      }
    };
    getStudentlist();
  }, []);

  useEffect(() => {
    const getGroups = async () => {
      const { data, error } = await supabase.from("group").select("*");
      if (error) {
        setErrorMessage(error.message);
      } else if (data) {
        setGrouplist(data);
        setIsStudentlistLoaded(true);
      }
    };
    getGroups();
  }, [studentlist]);

  return (
    <main className=" flex flex-col items-center gap-4">
      <Navbar>
        <NavbarContent>
          <NavbarItem>
            <p>Профиль учителя</p>
          </NavbarItem>
          <NavbarItem>
            <Button isDisabled={true}>Студенты</Button>
          </NavbarItem>
          <NavbarItem>
            <Button onPress={() => router.push("/groups")}>Группы</Button>
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
        {isStudentlistLoaded ? (
          <p>Всего студентов: {studentlist.length}</p>
        ) : (
          <h1 className="h-6 w-52 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded"></h1>
        )}
      </section>
      <div className="grid grid-cols-3 gap-4 w-[65vw]">
        {isStudentlistLoaded ? (
          studentlist.map((student) => (
            <Card key={student.id} className="min-h-52">
              <CardHeader>
                <Link
                  href={`/student/${Number(student.id) ** 2 * 1375}`}
                  key={student.id}
                  className="w-full"
                >
                  <h1 className="font-bold">Студент {student.id}</h1>
                </Link>
              </CardHeader>
              <CardBody className="gap-2">
                <img
                  src={student.photo_url}
                  alt=""
                  className="w-24 h-24 object-cover"
                />
                <p>
                  {student.surname} {student.name} {student.second_name}
                </p>
                <p>{`Группа ${
                  grouplist.find((group) => group.id === student.group_id).name
                }`}</p>
              </CardBody>
            </Card>
          ))
        ) : (
          <div></div>
        )}
        <Card className={isStudentlistLoaded ? "min-h-52" : "hidden"}>
          <CardHeader>
            <h1 className="font-bold">Добавить студента</h1>
          </CardHeader>
          <CardBody>
            <CreateStudent />
          </CardBody>
        </Card>
      </div>

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
