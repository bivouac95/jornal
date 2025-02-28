"use client";

import supabase from "../../supabase";
import CreateMark from "../../components/create_mark";
import Header from "../../components/heda";

import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Button,
  Alert,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/react";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, YAxis } from "recharts";

export default function Student() {
  const [errorMessage, setErrorMessage] = useState("");
  const [student, setStudent] = useState({});
  const [group, setGroup] = useState({});
  const [marks, setMarks] = useState([]);
  const [marksDates, setMarksDates] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubjectsLoaded, setIsSubjectsLoaded] = useState(false);
  const [studenID, setStudentID] = useState(undefined);
  const params = useParams();

  const router = useRouter();

  useEffect(() => {
    const getStudentID = async () => {
      setStudentID(params.id);
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
        setMarks(data);
        const dates = data.map((mark) => mark.date);
        setMarksDates(Array.from(new Set(dates)));
        setIsLoaded(true);
      }
    };
    const getSubjects = async () => {
      console.log("get subjs");
      const { data, error } = await supabase.from("subject").select("*");
      if (error) {
        setErrorMessage(error.message);
      } else if (data) {
        setSubjects(data);
        setIsSubjectsLoaded(true);
      }
    };

    if (student.id !== undefined) {
      getMarks();
      getSubjects();
    }
  }, [student]);

  const getMedian = () => {
    let medians = [];
    if (marksDates.length > 0) {
      for (let i = 0; i < marksDates.length; i++) {
        let marksByDate = marks.filter(
          (mark) => new Date(mark.date) <= new Date(marksDates[i])
        );
        medians.push({
          Дата: new Date(marksDates[i]).toLocaleDateString("ru-RU"),
          "Средний балл":
            (marksByDate.reduce((a, b) => a + b.value, 0) / marksByDate.length).toFixed(2),
        });
      }
    }
    return medians;
  };

  return (
    <div className="flex flex-col items-center">
      <Header />
      <main className="w-full max-w-[1350px] grid grid-cols-3 gap-4 p-4 box-border">
        <Card className="col-span-1">
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
            <Button onPress={() => router.back()}>Вернуться назад</Button>
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
                  ? (
                      marks.reduce((a, b) => a + b.value, 0) / marks.length
                    ).toFixed(1)
                  : 0
              }`}</p>
            ) : (
              <div className="h-6 w-48 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded"></div>
            )}
            <CreateMark student_id={1} />
          </CardBody>
        </Card>
        <div className="col-span-2 flex flex-col gap-4">
          {isSubjectsLoaded && isLoaded ? (
            <div className="h-min col-span-2 overflow-x-scroll">
              <Table className="min-w-full" aria-label="Оценки студента">
                <TableHeader>
                  <TableColumn>Предмет</TableColumn>
                  {marksDates.map((date) => (
                    <TableColumn key={date}>
                      {new Date(date).toLocaleDateString("ru-RU")}
                    </TableColumn>
                  ))}
                </TableHeader>
                <TableBody>
                  {subjects.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell className="text-[16px]">
                        {subject.name}
                      </TableCell>
                      {marksDates.map((date) => (
                        <TableCell
                          key={date + subject.id + student.id + "mark"}
                        >
                          {marks.find(
                            (mark) =>
                              mark.date === date &&
                              mark.subject_id === subject.id &&
                              mark.student_id === student.id
                          )
                            ? marks.find(
                                (mark) =>
                                  mark.date === date &&
                                  mark.subject_id === subject.id &&
                                  mark.student_id === student.id
                              ).value
                            : ""}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <></>
          )}

          {isLoaded && (
            <Card className="h-96 w-full">
              <CardHeader>
                Динамика среднего балла
              </CardHeader>
              <Divider />
              <CardBody className="p-4 flex box-border">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart width={100} height={100} data={getMedian()}>
                    <Line dataKey={"Средний балл"} />
                    <XAxis dataKey={"Дата"} />
                    <YAxis domain={[0, 5]} tickCount={6}/>
                    <Tooltip />
                  </LineChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          )}
        </div>

        <Alert
          className="absolute bottom-3 left-3 w-96"
          color="danger"
          isVisible={errorMessage !== ""}
        >
          <p>{errorMessage}</p>
        </Alert>
      </main>
    </div>
  );
}
