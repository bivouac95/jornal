"use client";

import supabase from "../../supabase";
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
import { useParams } from "next/navigation";

export default function Group() {
  const [errorMessage, setErrorMessage] = useState("");
  const [group, setGroup] = useState({});
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isLoaded, setIsLoaded] = useState(true);
  const params = useParams();

  const router = useRouter();

  useEffect(() => {
    const getGroup = async () => {
      const { data, error } = await supabase
        .from("group")
        .select("*")
        .eq("id", params.id);
      if (error) {
        setErrorMessage(error.message);
      } else if (data) {
        setGroup(data[0]);
      }
    };
    getGroup();
  }, []);

  useEffect(() => {
    const getStudents = async () => {
      const { data, error } = await supabase
        .from("student")
        .select("*")
        .eq("group_id", params.id);
      if (error) {
        setErrorMessage(error.message);
      } else if (data) {
        setStudents(data);
      }
    };

    getStudents();
  }, []);

  useEffect(() => {
    const getSubjects = async () => {
      const { data, error } = await supabase
        .from("subject")
        .select("*")
        .eq("group_id", params.id);
      if (error) {
        setErrorMessage(error.message);
      } else if (data) {
        setSubjects(data);
      }
    };
    getSubjects();
  }, []);

  return (
    <main className="flex flex-col items-center">
      <Navbar>
        <NavbarContent>
          <NavbarItem>
            <p>Профиль группы</p>
          </NavbarItem>
          <NavbarItem>
            <Button onPress={() => router.back()}>Вернуться назад</Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      {isLoaded ? (
        <section className="flex flex-col gap-2 w-[65vw]">
          <h2 className="text-2xl">Название группы: {group.name}</h2>
          <h3 className="text-xl font-bold">Предметы</h3>
          {subjects.map((subject) => (
            <Card key={subject.id}>
              <CardHeader>
                <Link
                  href={`/subject/${subject.id}`}
                  key={subject.id}
                  className="w-full"
                >
                  <h1 className="font-bold">Предмет {subject.id}</h1>
                </Link>
              </CardHeader>
              <CardBody>
                <p>{subject.name}</p>
              </CardBody>
            </Card>
          ))}
          <h3 className="text-xl font-bold">Студенты</h3>
          <div className="grid grid-cols-3 gap-4 w-[65vw]">
            {isLoaded ? (
              students.map((student) => (
                <Card key={student.id} className="min-h-52">
                  <CardHeader>
                    <Link
                      href={`/student/${student.id}`}
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
                    <p>{`Группа ${group.name}`}</p>
                  </CardBody>
                </Card>
              ))
            ) : (
              <div></div>
            )}
          </div>
        </section>
      ) : (
        <div></div>
      )}
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
