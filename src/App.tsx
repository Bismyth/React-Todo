import { useState } from "react";
import {
    Container,
    ListGroup,
    ListGroupItem,
    ListGroupItemHeading,
    ListGroupItemText,
    Modal,
    ModalBody,
    ModalHeader,
} from "reactstrap";
import { v4 as uuid } from "uuid";
import { task } from "./Buttons/Types";
import initialData from "./data.json";

import Done from "./Buttons/Done";
import Delete from "./Buttons/Delete";
import Edit from "./Buttons/Edit";
import Add from "./Buttons/Add";

const App = () => {
    const [data, setData] = useState(
        initialData.map((v) => {
            return { ...v, id: uuid() };
        })
    );
    const [modalTask, setModalTask] = useState<task | undefined>(undefined);
    const [modal, setModal] = useState(false);
    const toggle = (e?: React.MouseEvent<any, MouseEvent>, id?: string) => {
        if (id) setModalTask(data.filter((v) => v.id === id)[0]);
        setModal((v) => !v);
    };
    return (
        <Container>
            <div className="d-flex align-items-center">
                <h1 className="mt-2 mb-4">Todo App</h1>
                <span className="ml-auto">
                    <Add setData={setData} />
                </span>
            </div>

            <ListGroup>
                {data
                    .sort((a, b) => +b.completed - +a.completed || a.name.localeCompare(b.name))
                    .map((v) => (
                        <ListGroupItem
                            key={v.id}
                            className="d-flex"
                            color={v.completed ? "success" : ""}
                        >
                            <Done setData={setData} id={v.id} completed={v.completed} />
                            <a
                                href="#"
                                onClick={(e) => {
                                    toggle(e, v.id);
                                }}
                                className="text-dark"
                            >
                                {v.name}
                            </a>
                            <span className="ml-auto d-flex">
                                <Edit setData={setData} task={v} />
                                <Delete setData={setData} id={v.id} />
                            </span>
                        </ListGroupItem>
                    ))}
            </ListGroup>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>{modalTask ? modalTask.name : ""}</ModalHeader>
                <ModalBody>
                    <ListGroup>
                        <ListGroupItem>
                            <ListGroupItemHeading>Description:</ListGroupItemHeading>
                            <ListGroupItemText>
                                {modalTask ? modalTask.description : ""}
                            </ListGroupItemText>
                        </ListGroupItem>
                        <ListGroupItem>
                            <ListGroupItemHeading>Date Created:</ListGroupItemHeading>
                            <ListGroupItemText>
                                {modalTask ? new Date(modalTask.dateCreated).toDateString() : ""}
                            </ListGroupItemText>
                        </ListGroupItem>
                        {modalTask && modalTask.completed ? (
                            <ListGroupItem>
                                <ListGroupItemHeading>Date Completed:</ListGroupItemHeading>
                                <ListGroupItemText>
                                    {modalTask
                                        ? new Date(modalTask.dateCompleted).toDateString()
                                        : ""}
                                </ListGroupItemText>
                            </ListGroupItem>
                        ) : null}
                    </ListGroup>
                </ModalBody>
            </Modal>
        </Container>
    );
};

export default App;
