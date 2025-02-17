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
  Divider
} from "@heroui/react";
import { useState, useEffect } from "react";
import supabase from "../supabase";

export default function CreateStudent() {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [groups, setGroups] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = Object.fromEntries(new FormData(e.currentTarget));
    
    // const { error } = await supabase.from("student").insert(data);
    // if (error) {
    //   setErrorMessage(error.message);
    // } else {
    //   setOpen(false);
    // }

    console.log(data);
  };

  useEffect(() => {
    const getGroup = async () => {
      const { data, error } = await supabase
        .from("group")
        .select("*")
      if (error) {
        setErrorMessage(error.message);
      } else if (data) {
        setGroups(data);
        setIsLoaded(true);
      }
    };
    getGroup();
  }, []);

  return (
    <>
      <Button onPress={() => setOpen(true)}>Добавить студента</Button>

      <Modal isOpen={open} onClose={() => setOpen(false)} className="p-3">
        <ModalContent>
          <ModalHeader>Добавить студента</ModalHeader>
          <ModalBody>
            <Form onSubmit={handleSubmit}>
              <Input label="Фамилия" name="surname" />
              <Input label="Имя" name="name" />
              <Input label="Отчество" name="second_name" />
              <Input label="Возраст" name="age" />
              {isLoaded && (
                <Select label="Группа" name="group_id">
                {groups.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}          
              </Select>
              )}
              <Input label="Аватар (ссылка)" name="photo_url"></Input>
              <Divider className="my-3"/>
              <Button type="submit">Добавить</Button>
              {errorMessage && (
                <Alert type="danger">{errorMessage}</Alert>
              )}
            </Form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
