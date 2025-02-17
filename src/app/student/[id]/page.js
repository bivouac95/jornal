"use client";

import supabase from "../../supabase";
import CreateMark from "../../components/create_mark";

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

export default function Student() {
  const [userId, setUserId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [student, setStudent] = useState({});
  const [group, setGroup] = useState({});
  const [marks, setMarks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [studenID, setStudentID] = useState(undefined);
  const params = useParams();

  const router = useRouter();

  useEffect(() => {
    const getStudentID = async () => {
      setStudentID(Math.sqrt(Number(params.id) / 1375));
    };
    getStudentID();
  }, []);

  useEffect(() => {
    const getStudent = async () => {
      if (studenID != undefined) {
        const { data, error } = await supabase
          .from("student")
          .select("*")
          .eq("id", studenID);
        if (error) {
          setErrorMessage(error.message);
        } else if (data) {
          setStudent(data[0]);
        }
      }
    };
    getStudent();
  }, [studenID]);

  useEffect(() => {
    const getGroup = async () => {
      const { data, error } = await supabase
        .from("group")
        .select("*")
        .eq("id", student.group_id);
      if (error) {
        setErrorMessage(error.message);
      } else if (data) {
        setGroup(data[0]);
      }
    };
    if (student.group_id !== undefined) {
      getGroup();
    }
  }, [student]);

  useEffect(() => {
    const getMarks = async () => {
      const { data, error } = await supabase
        .from("mark")
        .select("*")
        .eq("student_id", student.id);
      if (error) {
        setErrorMessage(error.message);
      } else if (data) {
        let marks_data = data;
        setMarks(marks_data.map((mark) => mark.value));
        setIsLoaded(true);
      }
    };
    if (student.id !== undefined) {
      getMarks();
    }
  }, [student]);

  return (
    <main className=" h-[85vh]">
      <Navbar>
        <NavbarContent>
          <NavbarItem>
            <p>Профиль студента</p>
          </NavbarItem>
          <NavbarItem>
            <Button onPress={() => router.back()}>Вернуться назад</Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <div className="flex justify-center items-center w-screen h-full">
        <Card>
          <CardHeader>
            {isLoaded ? (
              <p className="text-2xl">
                {`${student.surname} ${student.name} ${student.second_name}`}
              </p>
            ) : (
              <div className="h-6 w-64 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded"></div>
            )}
          </CardHeader>

          <Divider />
          <CardBody className="flex gap-4">
            <img
              src={isLoaded ? student.photo_url : null}
              alt=""
              className="w-full h-72 rounded-lg object-cover"
            />
            {isLoaded ? (
              <p>{`Группа: ${group.name}`}</p>
            ) : (
              <div className="h-6 w-48 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded"></div>
            )}

            {isLoaded ? (
              <p>{`Средняя оценка: ${
                marks.length !== 0
                  ? marks.reduce((a, b) => a + b, 0) / marks.length
                  : 0
              }`}</p>
            ) : (
              <div className="h-6 w-48 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded"></div>
            )}
            <CreateMark student_id={student.id}/>
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
