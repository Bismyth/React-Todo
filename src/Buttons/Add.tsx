import { Fragment, useState } from "react";
import { ReactComponent as AddBtn } from "../icons/add_task-black-24dp.svg";
import { setData } from "./Types";
import FormModal from "./FormModal";
import "./Button.css";

type AddProps = {
    setData: setData;
};

const Delete = ({ setData }: AddProps) => {
    const [modal, setModal] = useState(false);
    const toggle = () => {
        setModal((v) => !v);
    };
    return (
        <Fragment>
            <AddBtn className="icon" style={{ height: "30px", width: "30px" }} onClick={toggle} />
            <FormModal
                setData={setData}
                modal={modal}
                toggle={toggle}
                name="Add Task"
                initialValues={{
                    name: "",
                    description: "",
                }}
            />
        </Fragment>
    );
};

export default Delete;
