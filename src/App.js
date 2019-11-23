import React, {Component} from 'react';
import "./style.css";
import axios from "axios";

class App extends Component{
  constructor(props){
    super(props);
    this.state={
      dataApi:[], 
      edit:false, 
      dataPost:{id:0, nama_karyawan:"", jabatan:"", jenis_kelamin:"", tanggal_lahir:""}
    }
    
    this.handleRemove=this.handleRemove.bind(this);
    this.inputChange=this.inputChange.bind(this);
    this.onSubmitForm=this.onSubmitForm.bind(this);
  }

clearData=()=>{
  let newdataPost={...this.state.dataPost};
    newdataPost['id']="";
    newdataPost['nama_karyawan']="";
    newdataPost['jabatan']="";
    newdataPost['jenis_kelamin']="";
    newdataPost['tanggal_lahir']="";

    this.setState({dataPost:newdataPost});
}

  getDataId=(e)=>{
    axios.get(`http://localhost:3004/posts/${e.target.value}`).then(res=>{this.setState({dataPost:res.data, edit:true})})
  }

  onSubmitForm=()=>{
    if(this.state.edit===false){
    axios.post(`http://localhost:3004/posts`,this.state.dataPost).then(()=>{
      this.reloadData(); 
      this.clearData();

    });
    }else{
      axios.put(`http://localhost:3004/posts/${this.state.dataPost.id}`, this.state.dataPost).then(()=>{
        this.reloadData();
        this.clearData();
      })
    }   
  }

  inputChange(e){
    let newdataPost = {...this.state.dataPost};
    if(this.state.edit===false){
    newdataPost['id'] = new Date().getTime();
    }
    newdataPost[e.target.name] = e.target.value;
    this.setState(
      {
        dataPost:newdataPost
      }, ()=> console.log(this.state.dataPost)
    )
  }

  handleRemove(e){
    console.log(e.target.value);
    fetch(`http://localhost:3004/posts/${e.target.value}`,{method:"DELETE"}).then(res => this.reloadData());
  }

  reloadData(){
    axios.get("http://localhost:3004/posts").then(res=>{this.setState({dataApi:res.data, edit:false});
  });
  }



  componentDidMount(){
    this.reloadData();
  }

  render(){
    return(
      <div>
        <div className="navbar">
          <h1>Data Karyawan</h1>
        </div>
        <br/><br/><br/>

        
          
            <input type="text" name="nama_karyawan" value={this.state.dataPost.nama_karyawan} onChange={this.inputChange} placeholder="Masukkan nama karyawan" />
            <input type="text" name="jabatan" value={this.state.dataPost.jabatan} onChange={this.inputChange} placeholder="Masukkan jabatan" />
            <input type="text" name="jenis_kelamin" value={this.state.dataPost.jenis_kelamin} onChange={this.inputChange} placeholder="Masukkan jenis kelamin"/>
            <input type="date" name="tanggal_lahir" value={this.state.dataPost.tanggal_lahir} onChange={this.inputChange}  />
            <button type="submit" onClick={this.onSubmitForm} className="savedata">Save Data</button>
                    
         <br/><br/>

        {this.state.dataApi.map((data,index)=>{
          return(
            <div key={index}>
              <div className="biodata">
                <p>Nama : {data.nama_karyawan}</p>
                <p>Jabatan : {data.jabatan}</p>
                <p>Jenis Kelamin : {data.jenis_kelamin}</p>
                <p>Tanggal Lahir : {data.tanggal_lahir}</p>
                <br />
                <button className="delete" value={data.id} onClick={this.handleRemove}><b>Delete</b></button>
                <button value={data.id} onClick={this.getDataId} className="editdata"><b>Edit Data</b></button>
              </div> <br /> <br/>
            </div>
          )
        })}
        

      </div>
    )
  }
    
  
}

export default App;
