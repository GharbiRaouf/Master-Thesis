import React from "react";
// nodejs library that concatenates classes
// import classNames from "classnames";
// react plugin used to create charts
// import { Line, Bar } from "react-chartjs-2";
import Pusher from 'pusher-js';

// Enable pusher logging - don't include this in production


// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  UncontrolledCollapse,
  Input,
  ListGroupItem,
  ListGroup,
  Row,
  Col,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Modal
} from "reactstrap";
import Axios from "axios";
import {API_URL} from "../utils/server_constants";

Pusher.logToConsole = false;
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.renderAiModal = this.renderAiModal.bind(this);
    this.state = {
      modalOpen: false,
      searchedUserName:'',
      searchedUsers:[],
      users:[],
      canvas_notes:[]
    };
  }
  reduceNotes = (user) => {
    return this.state.canvas_notes.reduce((a, e) => {
      if ((e["note_author"] === user["username"])||(e["note_author"]===user["email"])) a.push(e);
      return a;
    }, [])
  }

  async load_all_data() {
    await Axios.get(API_URL+"get_online_users").then(response => {
      // alert(JSON.stringify(response.data))
      // console.log(response.data);

      this.setState({
        // users: response.users,
        // canvas_notes: response.canvas_notes
        users: response.data.result,
          searchedUsers:response.data.result

      })
    })
      Axios.get(API_URL+'list_notes').then(response => {
      // alert(JSON.stringify(response.data))
      // console.log(response.data);

      this.setState({
          canvas_notes:response.data.listed
      })
    })

  }

  componentDidMount() {
    var pusher = new Pusher('c2d71706fcd3133d8f57', {
      cluster: 'eu',
      forceTLS: true
    });
    var self = this;
    this.load_all_data();
    let {canvas_notes} =this.state;
    var user_channel = pusher.subscribe('user');
    user_channel.bind('user_joined', function (data) {
      self.setState({
        users: [...self.state.users, data['user_detail']],
        searchedUsers: self.state.users

      })
    });
    user_channel.bind('user_left', data =>{
      var users=this.state.users;
      alert("user_left");
      for (let i = 0; i < users.length; i++) {
        if(users[i]["email"].toLowerCase()===data['user_detail']["email"].toLowerCase()){
          users.splice(i,1);
          break
        }
      }
      self.setState({
        users
      })
    });
    var canvas_channel = pusher.subscribe('canvas');
    canvas_channel.bind('note_field_update', data => {
      console.log(data);

      this.updateNotes(data, false);
    });
    canvas_channel.bind('note_deleted',data=>{
        alert(data,"deleted")
        let arr=canvas_notes;
        for(var i =0;i<arr.length;i++){
            if(arr[i]["note_canvas"]===data){
                arr.splice(i,1)
            }
        }
        this.setState({
            canvas_notes:arr
        })
    })
    canvas_channel.bind('canvas_delete',data=>{
        let arr=canvas_notes;
        alert(data)
        for(var i =0;i<arr.length;i++){
            if(arr[i]["note_canvas"]===data.target_canvas){
                arr.splice(i,1)
            }
        }
        this.setState({
            canvas_notes:arr
        })
    })


  }

  updateNotes = (note_data , reload = true) => {
    let canvas_notes = this.state.canvas_notes, found = false;
    for (let i = 0; i < canvas_notes.length; i++) {
      if (canvas_notes[i]["note_id"] === note_data["note_id"]) {
        canvas_notes[i] = note_data;
        found = true;
        break;
      }
    }
    if (!found) canvas_notes.push(note_data);

    this.setState({
      canvas_notes
    })
    if (reload) Axios.post(API_URL+'force_update', {note_to_force:note_data}).then(response => {
      if(response.data.success){this.setState({
        modalOpen: false
      })}
    })
  }
  countSupervisedNotes=(user)=>{
    let cp=0,rn=this.reduceNotes(user);
    rn.forEach(e => {
      cp+=Boolean(e["note_is_supervised"])
    });
    return cp+"/"+rn.length;
  }

  renderAiModal = (note) => {
    this.setState({
      modalOpen: !this.state.modalOpen,
      note_to_force: note
    })
  }

  applyChanges = () => {
    const { note_to_force } = this.state
    note_to_force.note_is_supervised = true
    Axios.post(API_URL+"force_update",{
      note_to_force
    }).then(response=>{
      console.log(response.data);

      if(response.data.success)this.updateNotes(note_to_force)
    })

  }
  searchUser = event=>{
    let sun=event.target.value.toLowerCase()
    this.setState({
      searchedUserName:sun
    })
    const { users } = this.state
    if(sun.length>0 && Boolean(sun)){
    var searchedUsers=users.reduce((su,user)=>{
      if ((user["email"].toLowerCase().indexOf(sun)>-1) || (Boolean(user["username"])&&(user["username"].toLowerCase().indexOf(sun)>-1)))
        su.push(user)
      return su
    },[])
  }
    else {searchedUsers=users;}
    this.setState({
      searchedUsers
    })
  }
  revertChanges = () => {
    const { note_to_force } = this.state
    note_to_force.note_is_supervised = false
    this.updateNotes(note_to_force)
  }
  updateNoteToForce = (field, event) => {

    this.setState({
      note_to_force: {
        ...this.state.note_to_force,
        [field]: event.target.value
      }
    })
  }
  render() {
    const { users, note_to_force, modalOpen, searchedUserName, searchedUsers } = this.state;
    return (
      <>
        <Modal isOpen={modalOpen} toggle={this.renderAiModal} className={this.props.className}>
          {Boolean(note_to_force) &&
            <ModalHeader toggle={this.renderAiModal}>
              Modal title
              {note_to_force["note_is_supervised"] && <span className="float-right">
                <i className="tim-icons icon-pin" />
              </span>}
            </ModalHeader>}
          <ModalBody>
            {Boolean(note_to_force) &&
              <Row>


                <Col xs={6}>
                   <label htmlFor="oldrating">Old Rating</label>
                      <Input placeholder="" id="oldrating" readOnly type="number" value={note_to_force["note_ai_rating"]} /> &nbsp;
                   <label htmlFor="oldsuggestion">Old Suggestion</label>
                    <Input placeholder="" type="textarea" readOnly id="oldsuggestion" value={note_to_force["note_ai_suggestion"]} /> &nbsp;
              </Col>
                <Col xs={6}>
                  <label htmlFor="newrating">New Rating</label>
                  <Input placeholder="" id="newrating" type="number" onChange={(e) => this.updateNoteToForce("note_admin_rating", e)} /> &nbsp;
                <label htmlFor="newsuggestion">New Suggestion</label>
                  <Input placeholder="" type="textarea" id="newsuggestion" onChange={(e) => this.updateNoteToForce("note_admin_suggestion", e)} /> &nbsp;
              </Col>

              </Row>
            }
          </ModalBody>
          <ModalFooter>   <Row>            <Col xs={12} >

            <Button color="info" onClick={() => this.applyChanges(note_to_force)}>Apply Changes</Button>{' '}
            <Button color="danger" onClick={() => this.revertChanges(note_to_force)}>Revert Changes</Button>{' '}
            <Button color="secondary" onClick={this.renderAiModal}>Cancel</Button>                  </Col>

               <Col xs={12}>
                      {Boolean(note_to_force) &&
                          Object.keys(note_to_force).map((e,i)=>{
                              return <div key={i} > <strong>{e} :</strong> {JSON.stringify(note_to_force[e])}</div>
                          })
                      }
               </Col></Row>
          </ModalFooter>
        </Modal>
        <div className="content">
          <Row>
            <Col xs="12">
              <Card className="card-tasks">
                <CardHeader className="py-2 ">
                  <h6 className="title d-inline">
                    Canvas Updates
                  </h6>
                  <div className="float-right py-2 " >
                  <label>Search By User Name</label>
                  <Input placeholder="User Name" id="newsuggestion" onChange={this.searchUser} value={searchedUserName} /> &nbsp;

                  </div>
                </CardHeader>
                <CardBody>
                  <ListGroup>
                  {
                      users ? searchedUsers.map((e,i_e) => {
                        return <div key={i_e}><ListGroupItem tag="a" id={"toggler" + i_e} href="#" action>
                            Canvas made by {e["username"]} <small>{e["email"]}</small>
                          <span className="float-right">{this.countSupervisedNotes(e)}</span>
                        </ListGroupItem>
                          <UncontrolledCollapse toggler={"#toggler" + i_e}>

                            <ListGroupItem tag="a" href="#" >
                              <ListGroup>

                                {this.reduceNotes(e).map((a,i_a) => {
                                  return <ListGroupItem key={i_a} action onClick={() => this.renderAiModal(a)}>
                                    {Boolean(a["note_is_supervised"]) && <span className="float-right"><i className="tim-icons icon-pin" /> </span>}

                                      <strong>Note Headline: </strong>{a["note_headline"]}<br />
                                    <strong>Note Description: </strong>{a["note_description"]}
                                  </ListGroupItem>
                                }).concat([
                                  <ListGroupItem key="end" className="text-center list-group-item py-2 small" action id={"toggler" + i_e} color="info">
                                    Collapse All
                                  </ListGroupItem>
                                ])}
                              </ListGroup>

                            </ListGroupItem>
                          </UncontrolledCollapse></div>
                      }) : null
                    }
                  </ListGroup>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Dashboard;
