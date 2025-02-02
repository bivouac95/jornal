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
  const [subject, setSubject] = useState({});
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const params = useParams();

  const router = useRouter();

  useEffect(() => {
    const getSubject = async () => {
      const { data, error } = await supabase
        .from("subject")
        .select("*")
        .eq("id", params.id);
      if (error) {
        setErrorMessage(error.message);
      } else if (data) {
        setSubject(data[0]);
      }
    };
    getSubject();
  }, []);

  useEffect(() => {
    const getStudents = async () => {
      if (subject.group_id !== undefined) {
        const { data, error } = await supabase
          .from("student")
          .select("*")
          .eq("group_id", subject.group_id);
        if (error) {
          setErrorMessage(error.message);
        } else if (data) {
          setStudents(data);
        }
      }
    };
    getStudents();
  }, [subject]);

  useEffect(() => {
    const getMarks = async () => {
      const { data, error } = await supabase.from("mark").select("*");
      if (error) {
        setErrorMessage(error.message);
      } else if (data) {
        setMarks(data);
        setIsLoaded(true);
      }
    };
    getMarks();
  }, [students]);

  return (
    <main className="flex flex-col items-center">
      <Navbar>
        <NavbarContent>
          <NavbarItem>
            <p>Профиль предмета</p>
          </NavbarItem>
          <NavbarItem>
            <Button onPress={() => router.back()}>Вернуться назад</Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      {isLoaded ? (
        <section className="flex flex-col gap-4 w-[65vw]">
          <header className="flex flex-col gap-2">
            <h1 className="text-2xl">Название дисциплины: {subject.name}</h1>
            <h2 className="font-bold">Студенты</h2>
          </header>
          <div className="w-[65vw] flex flex-col gap-2">
            {students.map((student) => (
              <div key={student.id} className="w-full grid grid-cols-2 gap-2">
                <Card className={"w-[1fr]"}>
                  <CardHeader className="flex flex-row gap-4">
                    <Link className="text-xl" href={"/student/" + student.id}>
                      {student.name} {student.surname}
                    </Link>
                    {marks.filter((mark) => mark.student_id === student.id)
                      .length !== 0 ? (
                      <p>
                        Средний балл:{" "}
                        {marks
                          .filter((mark) => mark.student_id === student.id)
                          .reduce((a, b) => a + b.value, 0) /
                          marks.filter((mark) => mark.student_id === student.id)
                            .length}
                      </p>
                    ) : (
                      <p></p>
                    )}
                  </CardHeader>
                </Card>

                <div className="flex flex-row gap-1 items-center">
                  {marks
                    .filter((mark) => mark.student_id === student.id)
                    .map((mark) => (
                      <div
                        key={mark.id}
                        className=" w-8 h-8 flex items-center justify-center"
                      >
                        {mark.value}
                      </div>
                    ))}
                </div>
              </div>
            ))}
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
