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
} from "@heroui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [info, setInfo] = useState({
    email: "",
    password: "",
  });
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleInputEmail = (e) => {
    setInfo((prevState) => ({
      ...prevState,
      email: e.target.value,
    }));
    setIsValid(
        e.target.value !== "" &&
        info.password !== ""
    );
  };

  const handleInputPassword = (e) => {
    setInfo((prevState) => ({
      ...prevState,
      password: e.target.value,
    }));
    setIsValid(
        info.email !== "" &&
        e.target.value !== ""
    );
  };

  const sumbit = async () => {
    if (isValid) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: info.email,
        password: info.password,
      });
      if (error) {
        setErrorMessage(error.message);
        setInfo({
          email: info.email,
          password: "",
        });
      } else if (data) {
        router.push("/");
      }
    }
  };

  return (
    <main className="flex min-h-screen min-w-screen flex-col items-center justify-center gap-4">
      <Card className="w-96">
        <CardHeader>
          <h2 className="text-2xl font-bold">Войти</h2>
        </CardHeader>
        <Divider />
        <CardBody className="flex flex-col gap-2">
          <p>Электронная почта</p>
          <Input
            label="Email"
            type="email"
            onChange={handleInputEmail}
            value={info.email}
          />
          <p>Пароль</p>
          <Input
            label="Password"
            type="password"
            onChange={handleInputPassword}
            value={info.password}
          />
        </CardBody>
        <Divider />
        <CardFooter className="flex flex-row gap-2">
          <Button color="primary" isDisabled={!isValid} onPress={sumbit}>
            Войти
          </Button>
          <Button>У меня нет аккаунта</Button>
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
