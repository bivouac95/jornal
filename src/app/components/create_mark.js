"use client";

import {
  Form,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent,
  Alert,
  Select,
  SelectItem,
  Divider,
  DateInput,
} from "@heroui/react";
import { useState, useEffect } from "react";
import {parseZonedDateTime, parseAbsoluteToLocal, parseDate} from "@internationalized/date";
import supabase from "../supabase";

export default function CreateMark({ student_id = undefined, subject_id = undefined, small = false }) {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [subjects, setSubjects] = useState([]);

  const [isStudentSet, setIsStudentSet] = useState(false);
  const [isSubjectSet, setIsSubjectSet] = useState(false);

  const [isStudentChosen, setIsStudentChoosen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let data = Object.fromEntries(new FormData(e.currentTarget));
    if (isStudentSet) {
      data["student_id"] = `${student_id}`;
    }
    if (isSubjectSet) {
      data["subject_id"] = `${subject_id}`;
    }

    const { error } = await supabase.from("mark").insert(data);
    if (error) {
      setErrorMessage(error.message);
    } else {
      setOpen(false);
    }
  };

  useEffect(() => {
    const getSubjects = async () => {
      const { data, error } = await supabase.from("subject").select("*");
      if (error) {
        setErrorMessage(error.message);
      } else if (data) {
        setSubjects(data);
        setIsLoaded(true);
      }
    };

    const getGroups = async () => {
      const { data, error } = await supabase.from("group").select("*");
      if (error) {
        setErrorMessage(error.message);
      } else if (data) {
        setGroups(data);
        getSubjects();
      }
    };

    const getStudents = async () => {
      const { data, error } = await supabase.from("student").select("*");
      if (error) {
        setErrorMessage(error.message);
      } else if (data) {
        setStudents(data);
        getGroups();
      }
    };
    getStudents();
    
    if (student_id != undefined) {
      setIsStudentSet(true);
    }

    if (subject_id != undefined) {
      setIsSubjectSet(true);
    }
  }, []);

  const handleStudentChose = (e) => {
    const student = students.find(
      (student) => student.id === Number(e.target.value)
    );
    const studenSubjects = subjects.filter(
      (subject) => subject.group_id == student.group_id
    );
    setSubjects(studenSubjects);
    setIsStudentChoosen(true);
  };

  return (
    <>
      <Button onPress={() => setOpen(true)} className={small ? "w-5 h-5 min-w-0 p-0" : ""}>{small ? "+" : "Поставить оценку"}</Button>

      <Modal isOpen={open} onClose={() => setOpen(false)} className="p-3">
        <ModalContent>
          <ModalHeader>Поставить оценку</ModalHeader>
          <ModalBody>
            <Form onSubmit={handleSubmit}>
              {isLoaded && !isStudentSet && (
                <Select
                  label="Ученик"
                  name="student_id"
                  onChange={handleStudentChose}
                >
                  {students.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {`${item.surname} ${item.name} ${
                        groups.find((group) => group.id === item.group_id).name
                      }`}
                    </SelectItem>
                  ))}
                </Select>
              )}
              {isLoaded && isStudentChosen && !isSubjectSet && (
                <Select label="Предмет" name="subject_id">
                  {subjects.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.name}
                    </SelectItem>
                  ))}
                </Select>
              )}
              <Select label="Оценка" name="value">
                <SelectItem value="5" key="5">
                  5
                </SelectItem>
                <SelectItem value="4" key="4">
                  4
                </SelectItem>
                <SelectItem value="3" key="3">
                  3
                </SelectItem>
                <SelectItem value="2" key="2">
                  2
                </SelectItem>
                <SelectItem value="1" key="1">
                  1
                </SelectItem>
              </Select>
              <DateInput label="Дата" name="date" labelPlacement="outside" defaultValue={parseDate(new Date().toISOString().slice(0, 10))} />
              <Divider className="my-3" />
              <Button type="submit">Подтвердить</Button>
              {errorMessage && <Alert type="danger">{errorMessage}</Alert>}
            </Form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
