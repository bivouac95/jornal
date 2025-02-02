"use client";

import supabase from "../supabase";
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
  InputOtp,
  Select,
  SelectItem,
} from "@heroui/react";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [info, setInfo] = useState({
    name: "",
    surname: "",
    second_name: "",
  });

  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userId, setUserId] = useState("");
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

  const handleInputName = (e) => {
    setInfo(() => ({
      name: e.target.value,
      surname: info.surname,
      second_name: info.second_name,
    }));
    validate(e.target.value, info.surname, info.second_name);
  };

  const handleInputSurname = (e) => {
    setInfo(() => ({
      name: info.name,
      surname: e.target.value,
      second_name: info.second_name,
    }));
    validate(info.name, e.target.value, info.second_name);
  };

  const handleInputSecond_name = (e) => {
    setInfo(() => ({
      name: info.name,
      surname: info.surname,
      second_name: e.target.value,
    }));
    validate(info.name, info.surname, e.target.value);
  };

  const validate = (name, surname, second_name) => {
    setIsValid(name !== "" && surname !== "" && second_name !== "");
  };

  const sumbit = async () => {
    if (isValid) {
      if (userId !== "") {
        const { data, error } = await supabase.from("teacher").insert({
          name: info.name,
          surname: info.surname,
          second_name: info.second_name,
          user_id: userId,
        });
        if (error) {
          setErrorMessage(error.message);
        } else {
          router.push("/");
        }
      } else {
        setErrorMessage("Ошибка авторизации");
      }
    }
  };

  return (
    <main className="flex min-h-screen min-w-screen flex-col items-center justify-center gap-4">
      <Card className="w-96">
        <CardHeader>
          <h2 className="text-2xl font-bold">Данные учителя</h2>
        </CardHeader>
        <Divider />
        <CardBody className="flex flex-col gap-2">
          <p>Фамилия</p>
          <Input
            label="Фамилия"
            type="text"
            onChange={handleInputSurname}
            value={info.surname}
          />
          <p>Имя</p>
          <Input
            label="Имя"
            type="text"
            onChange={handleInputName}
            value={info.name}
          />
          <p>Отчество</p>
          <Input
            label="Отчество"
            type="text"
            onChange={handleInputSecond_name}
            value={info.second_name}
          />
        </CardBody>
        <Divider />
        <CardFooter className="flex flex-row gap-2">
          <Button color="primary" isDisabled={!isValid} onPress={sumbit}>
            Подтвердить
          </Button>
        </CardFooter>
      </Card>
      <Alert
        className="absolute top-3 w-96"
        color="danger"
        isVisible={errorMessage !== ""}
      >
        <p>{errorMessage}</p>
      </Alert>
    </main>
  );
}
