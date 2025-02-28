"use client";

import supabase from "./supabase";
import CreateStudent from "./components/create_student";
import CreateMark from "./components/create_mark";
import SaveSheet from "./components/save sheet";
import Header from "./components/heda";
import {
  Accordion,
  AccordionItem,
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
  Select,
  SelectItem,
} from "@heroui/react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [userId, setUserId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [studentlist, setStudentlist] = useState([]);
  const [grouplist, setGrouplist] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedGroupID, setSelectedGroupID] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isStudentlistLoaded, setIsStudentlistLoaded] = useState(false);
  const [isGrouplistLoaded, setIsGrouplistLoaded] = useState(false);
  const [isSubjectsLoaded, setIsSubjectsLoaded] = useState(false);
  const [marks, setMarks] = useState([]);
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
    const getStudentlist = async () => {
      const { data, error } = await supabase.from("student").select("*");
      if (error) {
        setErrorMessage(error.message);
      } else if (data) {
        setStudentlist(data);
        setIsStudentlistLoaded(true);
      }
    };

    const getGroups = async () => {
      const { data, error } = await supabase.from("group").select("*");
      if (error) {
        setErrorMessage(error.message);
      } else if (data) {
        setGrouplist(data);
        setIsGrouplistLoaded(true);
      }
    };

    const getSubjects = async () => {
      const { data, error } = await supabase.from("subject").select("*");
      if (error) {
        setErrorMessage(error.message);
      } else if (data) {
        setSubjects(data);
        setIsSubjectsLoaded(true);
      }
    };

    const getMarks = async () => {
      const { data, error } = await supabase.from("mark").select("*");
      if (error) {
        setErrorMessage(error.message);
      } else if (data) {
        setMarks(data);
      }
    };

    getStudentlist();
    getGroups();
    getSubjects();
    getMarks();
  }, [userId]);

  useEffect(() => {
    setIsLoaded(isGrouplistLoaded && isStudentlistLoaded && isSubjectsLoaded);
  }, [isGrouplistLoaded, isStudentlistLoaded, isSubjectsLoaded]);

  return (
    <main className=" flex flex-col items-center gap-4">
      <Header />
      <Card className="w-full flex justify-center box-border">
        <CardBody className="flex justify-center items-center ">
          {isLoaded ? (
            <Select
              label="Выберите группу"
              className="w-64"
              value={selectedGroupID}
              onSelectionChange={(e) => {
                setSelectedGroupID(Number(e.currentKey));
              }}
            >
              {grouplist.map((group) => (
                <SelectItem key={group.id}>{group.name}</SelectItem>
              ))}
            </Select>
          ) : (
            <span className="h-10 w-64 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded"></span>
          )}
        </CardBody>
      </Card>

      <div className="w-full max-w-[1350px] grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-4">
          <h2 className="w-full text-2xl text-center font-bold py-1">
            СТУДЕНТЫ
          </h2>
          <Divider />
          {isLoaded ? (
            studentlist
              .filter((student) => student.group_id === selectedGroupID)
              .map((student) => (
                <div key={student.id} className="flex w-full justify-between">
                  <Link
                    className="text-black decoration-none"
                    href={`/student/${student.id}`}
                  >{`${student.surname} ${student.name} ${student.second_name}`}</Link>
                  <span className="font-bold">
                    {marks
                      .filter((mark) => mark.student_id === student.id)
                      .reduce((acc, mark, _, { length }) => acc + mark.value / length, 0)
                      .toFixed(1) || "-"}
                  </span>
                </div>
              ))
          ) : (
            <div className="h-80 w-full bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded"></div>
          )}
          <CreateStudent />
          {isLoaded && selectedGroupID != 0 &&
            <SaveSheet />}
        </div>
        <div className="flex col-span-2 flex-col gap-4">
          <h2 className="w-full text-2xl text-center font-bold py-1 ">
            ПРЕДМЕТЫ
          </h2>
          <Divider />
          {isLoaded ? (
            <Accordion>
              {subjects.map((subject) => (
                <AccordionItem title={subject.name} key={subject.id}>
                  <div className="flex flex-col gap-4">
                    {studentlist
                      .filter((student) => student.group_id === selectedGroupID)
                      .map((student) => (
                        <div className="flex flex-row gap-4" key={student.id}>
                          <Link href={`/student/${student.id}`} className="text-black decoration-none">
                            {`${student.surname} ${student.name} ${student.second_name}`}
                          </Link>
                          <div className="flex flex-row gap-1">
                            {marks
                              .filter(
                                (mark) =>
                                  mark.student_id === student.id &&
                                  mark.subject_id === subject.id
                              )
                              .map((mark, index) => (
                                <div
                                  className="font-bold w-5 h-5 text-center"
                                  key={student.id + "_mark_" + index}
                                >
                                  {mark.value}
                                </div>
                              ))}
                            <CreateMark
                              student_id={student.id}
                              subject_id={subject.id}
                              small={true}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="h-80 w-full bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded"></div>
          )}
        </div>
      </div>
    </main>
  );
}

