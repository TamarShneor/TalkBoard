import axios from "axios";
import Cookies from 'js-cookie';
import { useEffect, useState } from "react";
import { TForum } from "../interfaces/forum";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { JSX } from "react/jsx-runtime";
import FormControl from '@mui/material/FormControl';
import { Button, Checkbox, TextField } from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { TUser } from "../interfaces/user";

export const ForumManagement = () => {

    const token = Cookies.get('JwtToken');
    const apiUri = 'http://localhost:3000';

    const [isPublic, setIsPublic] = useState<boolean>();
    const [editForum, setEditForum] = useState({ name: "", description: "", isPublic: false })
    const [edit, setEdit] = useState<boolean>(false)
    const [forums, setForums] = useState<TForum[]>([])
    const [render, setRender] = useState<boolean>()
    const [expanded, setExpanded] = useState<string | false>();
    const [admins, setAdmins] = useState<TUser[]>([]);


    useEffect(() => {
        getForums()
    }, [render])

    useEffect(() => {
        getAdmins()
    }, [forums])

    const getForums = () => {
        axios.get(`${apiUri}/forum`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        )
            .then(res => {
                setForums(res.data);
                getAdmins()
            })
            .catch(error => console.log(error))
    }


    const getForumsAdmin = (_id: string) => {
        let content: JSX.Element[] = [];
        axios.get(`${apiUri}/user/${_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        ).then((res) => {
            content.push(<p>{res.data.name}</p>);
        })
            .catch((err) => console.log(err))
        console.log("admin " + content)
        return content
    }

    const getAdmins = () => {
            axios.get(`${apiUri}/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            ).then((res) => setAdmins(res.data)
            )
                .catch((err) => console.log(err))
    }

    const updateForum = (forumId: string, index: number) => {
        const _editFoum = {
            _id: forumId,
            admin: forums[index].admin,
            subject: editForum.name ? editForum.name : forums[index].subject,
            isPublic: editForum.isPublic ? true : forums[index].isPublic,
            lastEdited: forums[index]?.lastEdited,
            password: forums[index]?.password,
            description: editForum.description ? editForum.description : forums[index].description,
            usersList: forums[index]?.usersList,
            categoriesList: forums[index]?.categoriesList,
        }
        const token = Cookies.get('JwtToken');
        axios.put(`${apiUri}/forum/${forumId}`, _editFoum,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        ).then(() => setRender(!render))
            .catch((err) => console.log(err))
    }

    const deleteForum = (_id: string) => {
        axios.delete(`${apiUri}/forum/${_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then(() => setRender(!render))
            .catch((err) => console.log(err))
    }

    const getDate = (_date: Date) => {
        if (_date != null) {
            const date: Date = new Date(_date);
            const tooday = new Date();
            if (date.getDate() == tooday.getDate() && date.getMonth() + 1 == tooday.getMonth() + 1 && date.getFullYear() == tooday.getFullYear()) {
                return `היום, בשעה ${date.getHours()}:${date.getMinutes()}`
            }
            else {
                return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
            }
        }
    }

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
            setEdit(false)
            setExpanded(newExpanded ? panel : false);
        };

    return (
        <div className="scroll list">
            {forums?.map((forum, i) => <>
                {/* {setCurrentForum(forum)} */}
                <Accordion expanded={expanded === forum._id} onChange={handleChange(forum._id)} TransitionProps={{ unmountOnExit: true }} className="item-of-list">
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>
                            <h6><b>{forum.subject}</b></h6>
                            {forum.description == "" ? (<br />) : (<small>{forum.description}</small>)}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            <strong>מנהל הפורום:</strong> {admins.find(a=>a._id== forum.admin)?.name} <br />
                            <strong>נערך לאחרונה:</strong> {getDate(forum?.lastEdited)}<br />
                            {edit ? (<div>
                                <FormControl>
                                    <strong>שם הפורום</strong>
                                    <TextField
                                        id="standard-helperText"
                                        variant="standard"
                                        defaultValue={editForum.name ? editForum.name : forum.subject}
                                        onChange={(event) => setEditForum({ ...editForum, ["name"]: event.target.value })}
                                    />
                                    <strong>תיאור הפורום</strong>
                                    <TextField
                                        id="standard-helperText"
                                        variant="standard"
                                        defaultValue={editForum.description ? editForum.description : forum.description}
                                        onChange={(event) => setEditForum({ ...editForum, ["description"]: event.target.value })}
                                    />
                                    {forum.isPublic ? (<></>) : (<p>
                                        <Checkbox icon={<LockIcon />} checkedIcon={<LockOpenIcon />} onChange={(event) => setEditForum({ ...editForum, ["isPublic"]: event.target.checked })} />
                                        ברצוני להפוך את הפורום לציבורי
                                    </p>)}
                                    <div className="button">
                                    <Button className='submit del' onClick={() => updateForum(forum._id, i)} >עדכון</Button>
                                    <Button className='submit del' onClick={() => setEdit(false)} >ביטול</Button>
                                    </div>
                                </FormControl>
                            </div>) : (<div>
                                <strong>סוג הפורום: </strong> {forum.isPublic ? (<>במה ציבורית</>) : (<>פורום פרטי</>)} <br />
                            </div>)}
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <IconButton onClick={() => deleteForum(forum._id)} aria-label="delete" size="large">
                                    <DeleteIcon />
                                </IconButton>
                                <IconButton onClick={() => setEdit(true)} aria-label="edit" size="large">
                                    <EditIcon />
                                </IconButton>
                            </Stack>
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </>
            )}
        </div>
    )
}
