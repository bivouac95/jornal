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
  Divider,
} from "@heroui/react";
import { useState, useEffect } from "react";
import supabase from "../supabase";

export default function CreateGroup() {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    const { error } = await supabase.from("group").insert(data);
    if (error) {
      setErrorMessage(error.message);
    } else {
      setOpen(false);
    }
  };

  return (
    <>
      <Button onPress={() => setOpen(true)}>Добавить группу</Button>

      <Modal isOpen={open} onClose={() => setOpen(false)} className="p-3">
        <ModalContent>
          <ModalHeader>Добавить группу</ModalHeader>
          <ModalBody>
            <Form onSubmit={handleSubmit}>
              <Input label="Название группы" name="name" />
              <Divider className="my-3"/>
              <Button type="submit">Добавить</Button>
              {errorMessage && <Alert type="danger">{errorMessage}</Alert>}
            </Form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
