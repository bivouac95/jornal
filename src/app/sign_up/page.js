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
import { useRouter } from "next/navigation";

export default function Home() {
  const [info, setInfo] = useState({
    email: "",
    password: "",
    second_password: "",
  });

  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleInputEmail = (e) => {
    setInfo(() => ({
      email: e.target.value,
      password: info.password,
      second_password: info.second_password,
    }));
    validate(e.target.value, info.password, info.second_password, code);
  };

  const handleInputPassword = (e) => {
    setInfo(() => ({
      email: info.email,
      password: e.target.value,
      second_password: info.second_password,
    }));
    validate(info.email, e.target.value, info.second_password, code);
  };

  const handleInputSecondPassword = (e) => {
    setInfo(() => ({
      email: info.email,
      password: info.password,
      second_password: e.target.value,
    }));
    validate(info.email, info.password, e.target.value, code);
  };

  const handleInputCode = (e) => {
    setCode(e.target.value);
    validate(info.email, info.password, info.second_password, e.target.value);
  };

  const validate = (email, password, second_password, newcode) => {
    setIsValid(
      email !== "" &&
        password !== "" &&
        second_password !== "" &&
        password === second_password && 
        newcode === "9991"
    );
  };

  const sumbit = async () => {
    if (isValid) {
      const { data, error } = await supabase.auth.signUp({
        email: info.email,
        password: info.password,
      });
      if (error) {
        setErrorMessage(error.message);
        setInfo({
          email: info.email,
          password: "",
          second_password: "",
        });
      } else if (data) {
        router.push("/student");
      }
    }
  };

  return (
    <main className="flex min-h-screen min-w-screen flex-col items-center justify-center gap-4">
      <Card className="w-96">
        <CardHeader>
          <h2 className="text-2xl font-bold">Регистрация</h2>
        </CardHeader>
        <Divider />
        <CardBody className="flex flex-col gap-2">
          <p>
            Пригласительный код
          </p>
          <InputOtp
            length={4}
            value={code}
            onChange={handleInputCode}
          />
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
          <p>Повторите пароль</p>
          <Input
            label="Password"
            type="password"
            isInvalid={!isValid}
            onChange={handleInputSecondPassword}
            value={info.second_password}
          />
        </CardBody>
        <Divider />
        <CardFooter className="flex flex-row gap-2">
          <Button color="primary" isDisabled={!isValid} onPress={sumbit}>
            Зарегестрироваться
          </Button>
          <Button>Уже есть аккаунт</Button>
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
