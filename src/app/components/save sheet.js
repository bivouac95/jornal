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
import supabase from "../supabase";
import * as xlsx from "xlsx";

export default function SaveSheet() {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedGroupID, setSelectedGroupID] = useState(0);
  const [selectedSubjectID, setSelectedSubjectID] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  function createGradeReport(data, marks_data, students_data) {
    const worksheetData = [];
    worksheetData.push(["Группа", groups.find((group) => group.id == data["group_id"]).name, "Дата", data["date"].slice(0, 7)]);
    worksheetData.push([
      "ФИО",
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
      "25",
      "26",
      "27",
      "28",
      "29",
      "30",
      "31",
      "Ср. балл",
    ]);

    const marksMap = {};
    marks_data.forEach((mark) => {
      const date = new Date(mark.date);
      const day = date.getDate();
      if (!marksMap[mark.student_id]) {
        marksMap[mark.student_id] = {};
      }
      marksMap[mark.student_id][day] = mark.value;
    });

    students_data.forEach((student) => {
      const row = [];
      row.push(`${student.surname} ${student.name} ${student.second_name}`);

      const marks = [];
      for (let day = 1; day <= 31; day++) {
        if (marksMap[student.id] && marksMap[student.id][day]) {
          marks.push(marksMap[student.id][day]);
          row.push(marksMap[student.id][day]);
        } else {
          row.push("");
        }
      }

      if (marks.length > 0) {
        row.push(Math.round((marks.reduce((sum, mark) => sum + mark, 0) / marks.length) * 10) / 10);
      } else {
        row.push("");
      }

      worksheetData.push(row);
    });

    const ws = xlsx.utils.aoa_to_sheet(worksheetData);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Sheet1");

    const filename = `Ведомость_${data["date"].slice(0, 7)}_${groups.find((group) => group.id == data["group_id"]).name}.xlsx`;
    xlsx.writeFile(wb, filename);
    setOpen(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = Object.fromEntries(new FormData(e.currentTarget));
    const marks_data = marks.filter((mark) => {
      return (
        mark.subject_id == data["subject_id"] &&
        mark.date.split("-")[0] == data["date"].split("-")[0] &&
        mark.date.split("-")[1] == data["date"].split("-")[1]
      );
    });
    const students_data = students.filter((student) => {
      return student.group_id == data["group_id"];
    });
    createGradeReport(data, marks_data, students_data);
  };

  useEffect(() => {
    const getStudentlist = async () => {
      const { data, error } = await supabase.from("student").select("*");
      if (error) {
        setErrorMessage(error.message);
      } else if (data) {
        setStudents(data);
      }
    };

    const getGroups = async () => {
      const { data, error } = await supabase.from("group").select("*");
      if (error) {
        setErrorMessage(error.message);
      } else if (data) {
        setGroups(data);
      }
    };

    const getSubjects = async () => {
      const { data, error } = await supabase.from("subject").select("*");
      if (error) {
        setErrorMessage(error.message);
      } else if (data) {
        setSubjects(data);
      }
    };

    const getMarks = async () => {
      const { data, error } = await supabase.from("mark").select("*");
      if (error) {
        setErrorMessage(error.message);
      } else if (data) {
        console.log(data);
        setMarks(data);
      }
    };

    const run = async () => {
      await getStudentlist();
      await getGroups();
      await getSubjects();
      await getMarks();
      setIsLoaded(true);
    };

    run();
  }, []);

  return (
    <>
      <Button onPress={() => setOpen(true)}>Скачать ведомость</Button>

      <Modal isOpen={open} onClose={() => setOpen(false)} className="p-3">
        <ModalContent>
          <ModalHeader>Скачать ведомость</ModalHeader>
          <ModalBody>
            <Form onSubmit={handleSubmit}>
              {isLoaded ? (
                <Select
                  label="Выберите группу"
                  className="w-full"
                  name="group_id"
                >
                  {groups.map((group) => (
                    <SelectItem key={group.id}>{group.name}</SelectItem>
                  ))}
                </Select>
              ) : (
                <span className="h-10 w-full bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded"></span>
              )}
              {isLoaded ? (
                <Select
                  label="Выберите предмет"
                  className="w-full"
                  name="subject_id"
                >
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id}>{subject.name}</SelectItem>
                  ))}
                </Select>
              ) : (
                <span className="h-10 w-full bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded"></span>
              )}
              <DateInput
                className="max-w-sm"
                label="Выберите дату"
                granularity="month"
                name="date"
              />
              <Button type="submit">Подтвердить</Button>
            </Form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

