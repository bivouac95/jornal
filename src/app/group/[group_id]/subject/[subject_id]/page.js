"use client";

import supabase from "../../../../supabase";
import CreateMark from "../../../../components/create_mark";

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
import { parseAppSegmentConfig } from "next/dist/build/segment-config/app/app-segment-config";

export default function Group() {
  const [errorMessage, setErrorMessage] = useState("");

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
      <p>{params.subject_id}</p>
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
